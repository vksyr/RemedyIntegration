import React, { useState } from "react";
import Select from "react-select";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import Circle from "@mui/icons-material/Circle";
import Square from "@mui/icons-material/Square";
import { grey, red, green, yellow } from "@mui/material/colors";
import IncidentItem from "./IncidentItem.tsx";
import _ from "lodash";
import {
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  RowDetailState,
  DataTypeProvider,
  PagingState,
  CustomPaging,
  IntegratedPaging
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  Toolbar,
  SearchPanel,
  TableHeaderRow,
  TableRowDetail,
  TableColumnVisibility,
  TableColumnResizing,
  PagingPanel,
  Template,
  TemplatePlaceholder
} from "@devexpress/dx-react-grid-material-ui";

import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import { Loading } from "./loading";
import { useToasts } from "react-toast-notifications";

export default function IncidentManager(props) {
  const { addToast } = useToasts();

  const dataSiteUrl = "data/";

  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState(null);
  const [group, setGroup] = useState(null);
  const [groupID, setGroupID] = useState(null);
  const [org, setOrg] = useState(null);
  const [serviceIDs, setServiceIDs] = useState([]);
  const [groups, setGroups] = useState([]);
  const [services, setServices] = useState([]);
  const priorities = [
    { label: "Low", value: "3" },
    { label: "Medium", value: "2" },
    { label: "High", value: "1" },
    { label: "Critical", value: "0" }
  ];
  const [selectedPriorities, setSelectedPriorities] = useState([
    { label: "Low", value: "3" },
    { label: "Medium", value: "2" },
    { label: "High", value: "1" },
    { label: "Critical", value: "0" }
  ]);
  const [loading, setLoading] = useState(false);
  const [myInterval, setMyInterval] = useState(null);
  const [show4HrContainmentView, setShow4HrContainmentView] = useState(false);
  const [showAgeKpi, setShowAgeKpi] = useState(false);
  const [ageKpiBtnCss, setAgeKpiBtnCss] = useState("disabled");
  const [ageKpiArrowColor, setAgeKpiArrowColor] = useState("disabled");
  const [ageKpiOptionsCss, setAgeKpiOptionsCss] = useState("disabled");
  const [kpiDateField, setKpiDateField] = useState("Submit_Date");
  const [greenMaxAge, setGreenMaxAge] = useState(90);
  const [yellowMaxAge, setYellowMaxAge] = useState(180);
  const [redMaxAge, setRedMaxAge] = useState(240);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const dropOffField = "Required_Resolution_DateTime";
  const dateFields = [
    { label: "Submit Date", value: "Submit_Date" },
    { label: "Last Modified", value: "Last_Modified_Date" },
    { label: "Last Resolved", value: "Last_Resolved_Date" },
    { label: "Reported Date", value: "Reported_Date" },
    { label: "Responded Date", value: "Responded_Date" },
    { label: "Closed Date", value: "Closed_Date" },
    { label: "Event Date", value: "Event_Date" },
    { label: "Required Resolution", value: "Required_Resolution_DateTime" },
    { label: "Estimated Resolution", value: "Estimated_Resolution_Date" },
    { label: "Acknowledgement Date", value: "Acknowledgment_Start_Date" },
    { label: "Resolution Start Date", value: "Resolution_Start_Date" },
    { label: "Last SLA Hold Date", value: "Last_SLA_Hold_Date" },
    { label: "VIP Assignment Date", value: "VIPAssignmentDateTime" },
    { label: "VIP Dispatch Date", value: "VIPDispatchDateTime" }
  ];

  const [columns, setColumns] = useState([
    { name: "Age_In_Minutes", title: "Age_In_Minutes" },
    { name: "Incident_Number", title: "Incident_Number" },
    {
      name: "Incident_Number_wIndicator",
      title: "Incident Number",
      getCellValue: (data) => {
        let _indicator = "";
        try {
          let _event_date = moment.unix(data.Event_Date).local();

          if (moment().diff(_event_date, "days") < 2) {
            _indicator = (
              <Square
                sx={{ color: "limeGreen", height: 18, marginTop: "-.11em" }}
              />
            );
          }
        } catch (ex) {}

        return (
          <div>
            {data.Incident_Number}
            {_indicator}
          </div>
        );
      }
    },
    { name: "PriorityCode", title: "Priority" },
    { name: "Description", title: "Summary" },
    { name: "Event_Date", title: "Event Date" },
    { name: "Last_Modified_Date", title: "Modified" },
    { name: "Assigned_Company_Group", title: "Company/Group" },
    { name: "Assignee", title: "Assignee" },
    { name: "StatusCode", title: "Status" },
    { name: "LastLog", title: "Last Log Entry" }
  ]);

  const [defaultColumnWidths, setDefaultColumnWidths] = useState([
    { columnName: "Age", width: 110 },
    { columnName: "Age_In_Minutes", width: 0 },
    { columnName: "Incident_Number_wIndicator", width: 160 },
    { columnName: "Incident_Number", width: 0 },
    { columnName: "PriorityCode", width: 90 },
    { columnName: "Description", width: "auto" },
    { columnName: "Submit_Date", width: 150 },
    { columnName: "Event_Date", width: 150 },
    { columnName: "Last_Modified_Date", width: 150 },
    { columnName: "Assigned_Company_Group", width: "auto" },
    { columnName: "Assignee", width: "auto" },
    { columnName: "StatusCode", width: 90 },
    { columnName: "LastLog", width: "auto" }
  ]);

  const tableColumnExtensions = [
    { columnName: "Description", wordWrapEnabled: true },
    { columnName: "LastLog", wordWrapEnabled: true }
  ];

  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  React.useEffect(() => {
    getIncidents();
  }, [currentPage]);

  React.useEffect(() => {
    let _defaultColumnWidths = _.cloneDeep(defaultColumnWidths);
    _defaultColumnWidths.push({
      columnName: kpiDateField,
      width: 150
    });
    setDefaultColumnWidths(_defaultColumnWidths);
  }, [kpiDateField]);

  React.useEffect(() => {
    if (company) {
      getGroups();
    }
  }, [company]);

  React.useEffect(() => {
    if (company && group && !show4HrContainmentView) {
      getIncidents();
    }
  }, [serviceIDs, selectedPriorities]);

  React.useEffect(() => {
    if (
      !show4HrContainmentView &&
      (localStorage.getItem("show4HrContainmentView") == null ||
        localStorage.getItem("show4HrContainmentView") == false)
    ) {
      getServices();
    }
    if (company && group) {
      getIncidents();
    }
  }, [groupID, selectedPriorities]);

  React.useEffect(() => {
    getView();
    getCompanies();
  }, []);

  React.useEffect(() => {
    if (isAutoRefresh) {
      setMyInterval(
        setInterval(() => {
          getIncidents();
        }, 120000)
      );
    } else {
      clearInterval(myInterval);
    }
    return () => {
      clearInterval(myInterval);
    };
  }, [isAutoRefresh]);

  React.useEffect(() => {
    if (showAgeKpi) {
      setAgeKpiArrowColor("primary");
      setAgeKpiBtnCss("active");
    } else {
      // Style dropdown
      setAgeKpiArrowColor("disabled");
      setAgeKpiBtnCss("disabled");
      setAgeKpiOptionsCss("disabled");
    }
    addKpiColumn();
  }, [showAgeKpi]);

  React.useEffect(() => {
    if (showAgeKpi) {
      getIncidents();
    }
  }, [greenMaxAge, yellowMaxAge, redMaxAge, kpiDateField]);

  React.useEffect(() => {
    if (show4HrContainmentView) {
      // set services
      setServices([{ label: "CyberSecurity", value: "CyberSecurity" }]);
      setServiceIDs([{ label: "CyberSecurity", value: "CyberSecurity" }]);

      // set priorities
      setSelectedPriorities([
        { label: "High", value: "1" },
        { label: "Critical", value: "0" }
      ]);
      setKpiDateField("Event_Date");
      setGreenMaxAge(90);
      setYellowMaxAge(180);
      setRedMaxAge(240);
      setShowAgeKpi(true);

      columns
        .filter((x) => x.name === "Event_Date")
        .forEach((column) => {
          column.title = "4-HR Start Date";
          column.name = kpiDateField;
        });

      // set service, company, group
      setCompany("All");
      setGroup("All");
      setOrg("All");
      setGroupID("All");

      //todo: highlight certain rows blue
    } else {
      columns
        .filter((x) => x.title === "4-HR Start Date")
        .forEach((column) => {
          column.title = "Event Date";
          column.name = "Event_Date";
        });
    }
  }, [show4HrContainmentView]);

  const saveView = () => {
    try {
      localStorage.setItem(
        "show4HrContainmentView",
        JSON.stringify(show4HrContainmentView)
      );
      localStorage.setItem("showAgeKpi", JSON.stringify(showAgeKpi));
      localStorage.setItem("greenMaxAge", greenMaxAge);
      localStorage.setItem("yellowMaxAge", yellowMaxAge);
      localStorage.setItem("redMaxAge", redMaxAge);
      localStorage.setItem("company", company);
      localStorage.setItem("org", org);
      localStorage.setItem("groupID", groupID);
      localStorage.setItem("group", group);
      localStorage.setItem("serviceIDs", JSON.stringify(serviceIDs));
      localStorage.setItem(
        "selectedPriorities",
        JSON.stringify(selectedPriorities)
      );
      localStorage.setItem("isAutoRefresh", JSON.stringify(isAutoRefresh));

      addToast("View saved successfully", {
        appearance: "success",
        autoDismiss: true,
        autoDismissTimeout: 2500
      });
    } catch (ex) {
      addToast("Error saving the view", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 2500
      });
    }
  };

  const getView = () => {
    setCompany(localStorage.getItem("company"));
    setOrg(localStorage.getItem("org"));
    setGroupID(localStorage.getItem("groupID"));
    setGroup(localStorage.getItem("group"));
    if (localStorage.getItem("serviceIDs") != null) {
      setServiceIDs(JSON.parse(localStorage.getItem("serviceIDs")));
    }
    if (localStorage.getItem("selectedPriorities") != null) {
      setSelectedPriorities(
        JSON.parse(localStorage.getItem("selectedPriorities"))
      );
    }
    setShow4HrContainmentView(
      JSON.parse(localStorage.getItem("show4HrContainmentView")) || false
    );
    setShowAgeKpi(JSON.parse(localStorage.getItem("showAgeKpi")) || false);
    setGreenMaxAge(localStorage.getItem("greenMaxAge") || 90);
    setYellowMaxAge(localStorage.getItem("yellowMaxAge") || 180);
    setRedMaxAge(localStorage.getItem("redMaxAge") || 240);
    setIsAutoRefresh(localStorage.getItem("isAutoRefresh") || false);
  };

  const noDataCell = (props) => {
    return loading ? (
      <td colSpan={props.colSpan} />
    ) : (
      <Table.NoDataCell {...props} />
    );
  };

  const addKpiColumn = () => {
    if (showAgeKpi) {
      setColumns(
        [{ getCellValue: getKpi, title: "Age", name: "Age" }].concat(
          columns.filter((x) => x.name !== "Age")
        )
      );
    } else {
      setColumns(columns.filter((x) => x.name !== "Age"));
    }
  };

  const getKpi = (data) => {
    let _color = grey[500];
    if (data.Age_KPI.indexOf("green.gif") !== -1) _color = green[500];
    else if (data.Age_KPI.indexOf("yellow.gif") !== -1) _color = yellow[500];
    else if (data.Age_KPI.indexOf("red.gif") !== -1) _color = red[500];

    let _text = "";
    let _age = 0;
    try {
      let _age = parseInt(data.Age_In_Minutes);
      let _greenMaxAge = parseInt(greenMaxAge);
      let _yellowMaxAge = parseInt(yellowMaxAge);
      let _redMaxAge = parseInt(redMaxAge);

      if (_age > _redMaxAge) {
        _text = "Exceeded!";
      } else if (_age > _yellowMaxAge) {
        _text = "-" + (_redMaxAge - _age);
      } else if (_age > _greenMaxAge) {
        _text = "-" + (_yellowMaxAge - _age);
      } else {
        _text = "-" + (_greenMaxAge - _age);
      }
    } catch (ex) {}

    return (
      <div>
        <Circle sx={{ color: _color }} /> {_text}
      </div>
    );
  };

  const getKpiParams = () => {
    return `StartDateField%3D${kpiDateField};DropOffField%3D${dropOffField};GreenMaxAge%3D${greenMaxAge};YellowMaxAge%3D${yellowMaxAge};RedMaxAge%3D${redMaxAge}`;
  };

  const dateFormatter = (epoch) => {
    return moment
      .unix(epoch | epoch.value)
      .local()
      .format("MM/DD/YYYY hh:mm"); // 01/11/2021
  };

  const DateTypeProvider = (props) => (
    <DataTypeProvider formatterComponent={dateFormatter} {...props} />
  );

  const TableRow = ({ row, ...restProps }) => (
    <Table.Row
      {...restProps}
      style={{
        backgroundColor:
          row.Assignee?.toLowerCase().indexOf("supervisor") != -1
            ? "rgba(179, 229, 252, .35)"
            : "transparent"
      }}
    />
  );

  const getCompanies = () => {
    fetch(`${dataSiteUrl}companies.json?opCode=GetCompanies`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        setCompanies([{ label: "All", value: "All" }].concat(json.data));
      });
  };

  const getGroups = () => {
    fetch(`${dataSiteUrl}groups.json?opCode=GetGroups&Company=${company}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        setGroups([{ label: "All", value: "All|All" }].concat(json.data));
      });
  };

  const getServices = () => {
    fetch(
      `${dataSiteUrl}services.json?opCode=GetServices&Company=${company}&Org=${org}&GroupID=${groupID}&Priorities=${priorities?.map(
        (x) => x.value
      )}&Filter=&KpiParams=${getKpiParams()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setServices(myJson.data);
      });
  };

  const getIncidents = () => {
    setRows([]);
    setLoading(true);

    let _services = serviceIDs?.map((x) => x.value);
    if (_services == "" || _services == null) {
      _services = "All";
    }

    let _priorities = selectedPriorities?.map((x) => x.value);
    if (_priorities == "" || _priorities == null) {
      _priorities = "3,2,1,0";
    }

    let _show4HrContainmentView = show4HrContainmentView ? "1" : "0";

    fetch(
      `${dataSiteUrl}incidents.json?opCode=GetIncidents&Page=${currentPage}&Company=${company}&Org=${
        org || "All"
      }&GroupID=${
        groupID || "All"
      }&Priorities=${_priorities}&Services=${_services}&Show4HrContainmentView=${_show4HrContainmentView}&Filter=&KpiParams=${getKpiParams()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setTotalCount(myJson.totalCount);
        setRows(myJson.data);
        setLastUpdated(moment());
        setLoading(false);
      });
  };

  const onCompanyChange = (val) => {
    setGroupID(null);
    setServiceIDs([]);
    setCompany(val.value);
  };

  const onGroupChange = (obj) => {
    setGroup(obj.value);
    if (obj.value.indexOf("|") !== -1) {
      setOrg(obj.value.split("|")[0]);
      setGroupID(obj.value.split("|")[1]);
    }
  };

  const onShowAgeKpiClick = () => {
    if (showAgeKpi) {
      setAgeKpiOptionsCss(
        ageKpiOptionsCss === "enabled" ? "disabled" : "enabled"
      );
      setAgeKpiBtnCss(ageKpiOptionsCss === "enabled" ? "active" : "selected");
    }

    if (ageKpiOptionsCss === "enabled") {
      getIncidents();
    }
  };

  const RowDetail = ({ row }) => {
    return <IncidentItem incidentNumber={row.Incident_Number} />;
  };

  return (
    <div>
      <div className="filter-container">
        <form>
          <label className="label-nowrap">
            Company:
            <Select
              className="companySel"
              onChange={onCompanyChange}
              options={companies}
              value={companies.filter(function (option) {
                return option.value === company;
              })}
            ></Select>
          </label>
          <label>
            Group:
            <Select
              className="groupSel"
              value={groups.filter(function (option) {
                return option.value === group;
              })}
              onChange={onGroupChange}
              options={groups}
              getOptionLabel={(x) => x.label}
              getOptionValue={(x) => x.value}
            ></Select>
          </label>
          <label>
            Services:
            <Select
              className="servicesSel"
              value={services.filter(function (service) {
                return serviceIDs.some((x) => service.value === x.value);
              })}
              onChange={(val) => {
                setServiceIDs((serviceIDs) => {
                  return val;
                });
              }}
              options={services}
              isMulti
            ></Select>
          </label>

          <label>
            Priorities:
            <Select
              value={priorities.filter(function (priority) {
                return selectedPriorities.some(
                  (x) => priority.value === x.value
                );
              })}
              onChange={(val) => {
                setSelectedPriorities((selectedPriorities) => {
                  return val;
                });
              }}
              options={priorities}
              classname="form-check-input"
              isMulti
            ></Select>
          </label>
          <div style={{ paddingTop: 10 }}>
            <label>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={show4HrContainmentView}
                  onChange={(e) => {
                    setShow4HrContainmentView(e.target.checked);
                  }}
                />
                <label
                  className="form-check-label"
                  for="flexSwitchCheckDefault"
                >
                  Show 4HR-Containment View
                </label>
              </div>
            </label>

            <label>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={showAgeKpi}
                  onChange={(e) => {
                    setShowAgeKpi(e.target.checked);
                  }}
                />
                <label
                  onClick={onShowAgeKpiClick}
                  className={"form-check-label age-kpi-btn-" + ageKpiBtnCss}
                  for="flexSwitchCheckDefault"
                >
                  Show age indicators
                  <ArrowDropDownIcon color={ageKpiArrowColor} />
                  <div
                    onClick={(event) => event.stopPropagation()}
                    className={"age-kpi-options-" + ageKpiOptionsCss}
                  >
                    <span className="close-icon" onClick={onShowAgeKpiClick}>
                      <CloseIcon fontSize="small" />
                    </span>
                    <div className="label-nowrap">
                      Age field:&nbsp;
                      <label>
                        <Select
                          onChange={(val) => setKpiDateField(val.value)}
                          options={dateFields}
                          value={dateFields.filter(function (option) {
                            return option.value === kpiDateField;
                          })}
                        ></Select>
                      </label>
                      <br />
                      Green Max Age:&nbsp;
                      <label>
                        <input
                          value={greenMaxAge}
                          onInput={(e) => setGreenMaxAge(e.target.value)}
                          type="text"
                          className="form-control"
                        />
                      </label>
                      <br />
                      Yellow Max Age:&nbsp;
                      <label>
                        <input
                          value={yellowMaxAge}
                          onInput={(e) => setYellowMaxAge(e.target.value)}
                          type="text"
                          className="form-control"
                        />
                      </label>
                      <br />
                      Red Max Age:&nbsp;
                      <label>
                        <input
                          value={redMaxAge}
                          onInput={(e) => setRedMaxAge(e.target.value)}
                          type="text"
                          className="form-control"
                        />
                      </label>
                    </div>
                    <span className="footer">* in minutes</span>
                  </div>
                </label>
              </div>
            </label>
            <label style={{ paddingRight: 9 }}>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isAutoRefresh}
                  onChange={() => setIsAutoRefresh(!isAutoRefresh)}
                />
                <label
                  className="form-check-label"
                  for="flexSwitchCheckDefault"
                >
                  Auto-refresh
                </label>
              </div>
            </label>
            <label>
              <input type="button" value="Save view" onClick={saveView} />
            </label>
          </div>
        </form>
      </div>
      <div className="grid">
        <Grid rows={rows} columns={columns} header={<IncidentItem />}>
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={setCurrentPage}
            pageSize={pageSize}
          />
          <CustomPaging totalCount={totalCount} />
          <SortingState
            defaultSorting={[{ columnName: "Name", direction: "asc" }]}
          />
          <IntegratedSorting />
          <RowDetailState />
          <SearchState defaultValue="" />
          <IntegratedFiltering />
          <DateTypeProvider for={dateFields?.map((x) => x.value)} />
          <Table
            noDataCellComponent={noDataCell}
            columnExtensions={tableColumnExtensions}
            rowComponent={TableRow}
          />
          <TableColumnVisibility
            defaultHiddenColumnNames={["Age_In_Minutes"]}
          />
          <TableColumnResizing
            resizingMode="nextColumn"
            defaultColumnWidths={defaultColumnWidths}
          />
          <TableHeaderRow showSortingControls />
          <PagingPanel />
          <TableRowDetail contentComponent={RowDetail} />
        </Grid>
        <label className="rem-footer">
          Last updated:{" "}
          {moment(lastUpdated).isValid()
            ? moment(lastUpdated).format("MM/DD/YYYY HH:mm")
            : "N/A"}
        </label>
        {loading && <Loading />}
      </div>
    </div>
  );
}
