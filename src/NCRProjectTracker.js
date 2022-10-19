import React, { useState } from "react";
import Select from "react-select";
import NCRItem from "./NCRItem.tsx";

import {
  SortingState,
  IntegratedSorting,
  SearchState,
  RowDetailState,
  IntegratedFiltering,
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
  PagingPanel
} from "@devexpress/dx-react-grid-material-ui";

import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import { Loading } from "./loading";

export default function NCRProjectTracker(props) {
  const dataSiteUrl = "data/";
  const remedyItemUrl = "[RemedyItemUrl]";
  const companies = [
    { label: "All", value: "All" },
    { label: "NCR", value: "NCR" },
    { label: "Crystal City", value: "Crystal City" }
  ];
  const [company, setCompany] = useState("All");
  const [sites, setSites] = useState([]);
  const [site, setSite] = useState("All");

  const [columns, setColumns] = useState([
    { name: "Site", title: "Location" },
    { name: "Infrastructure_Change_ID", title: "Change ID" },
    { name: "Description", title: "Summary" },
    { name: "Approved", title: "Approved" },
    { name: "ASCHG", title: "Assignee" },
    { name: "Change_Request_Status", title: "Remedy Status" },
    { name: "Current_Update", title: "Current Update" },
    { name: "Submit_Date", title: "Submitted" },
    { name: "Last_Modified_By", title: "Modified By" },
    { name: "Last_Modified_Date", title: "Modified On" }
  ]);
  const [defaultColumnWidths, setDefaultColumnWidths] = useState([
    { columnName: "Site", width: 150 },
    { columnName: "Infrastructure_Change_ID", width: 150 },
    { columnName: "Description", width: 450 },
    { columnName: "Approved", width: 120 },
    { columnName: "ASCHG", width: 230 },
    { columnName: "Change_Request_Status", width: 230 },
    { columnName: "Current_Update", width: 420 },
    { columnName: "Submit_Date", width: 150 },
    { columnName: "Last_Modified_By", width: 200 },
    { columnName: "Last_Modified_Date", width: 150 }
  ]);
  const tableColumnExtensions = [
    { columnName: "Description", wordWrapEnabled: true },
    { columnName: "Current_Update", wordWrapEnabled: true }
  ];
  const dateFields = [
    { label: "Submit Date", value: "Submit_Date" },
    { label: "Last Modified Date", value: "Last_Modified_Date" }
  ];
  const [loading, setLoading] = useState(false);
  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rows, setRows] = useState([]);

  const noDataCell = (props) => {
    return loading ? (
      <td colSpan={props.colSpan} />
    ) : (
      <Table.NoDataCell {...props} />
    );
  };

  const getLink = (data) => {
    let _filter = data.Infrastructure_Change_ID.substring(
      data.Infrastructure_Change_ID.lastIndexOf("0") + 1,
      data.Infrastructure_Change_ID.length
    );
    let _link =
      remedyItemUrl +
      "/?mode=search&amp;F304255500=CHG%3AInfrastructure%20Change&amp;F1000000076=FormOpenNoAppList&amp;F303647600=SearchTicketWithQual&amp;F304255610='Infrastructure%20Change%20ID'LIKE%22%25" +
      _filter +
      "%22";
    return (
      <a href={_link} target="_blank">
        {data.Infrastructure_Change_ID}
      </a>
    );
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

  const getSites = () => {
    fetch(`${dataSiteUrl}sites.json?opCode=GetNCRSites&Company=${company}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        setSites([{ label: "All", value: "All" }].concat(json.data));
      });
  };

  const getRows = () => {
    setRows([]);
    setLoading(true);

    fetch(
      `${dataSiteUrl}NCRItems.json?opCode=GetNCRItems&Page=${currentPage}&Company=${company}&Site=${site}`,
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
      .then(function (json) {
        setRows(json.data);
        let _columns = columns;
        _columns[1].getCellValue = getLink;
        setColumns(_columns);
        setLoading(false);
      });
  };

  const onCompanyChange = (val) => {
    setSite("All");
    getSites();
    setCompany(val.value);
  };

  const onSiteChange = (val) => {
    setSite(val.value);
  };

  React.useEffect(() => {
    getSites();
  }, []);

  React.useEffect(() => {
    getRows();
  }, [company, site]);

  const RowDetail = ({ row }) => {
    return <NCRItem infrastructureChangeID={row.Infrastructure_Change_ID} />;
  };

  return (
    <div>
      <div class="filter-container">
        <form>
          <label class="label-nowrap">
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
            Site:
            <Select
              className="sitesel"
              value={sites.filter(function (option) {
                return option.value === site;
              })}
              onChange={onSiteChange}
              options={sites}
              getOptionLabel={(x) => x.label}
              getOptionValue={(x) => x.value}
            ></Select>
          </label>
        </form>
      </div>
      <div class="grid">
        <Grid rows={rows} columns={columns}>
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={setCurrentPage}
            pageSize={pageSize}
          />
          <CustomPaging totalCount={totalCount} />
          <IntegratedPaging />
          <SortingState
            defaultSorting={[{ columnName: "Name", direction: "asc" }]}
          />
          <IntegratedSorting />
          <RowDetailState />
          <SearchState defaultValue="" />
          <IntegratedFiltering />
          <DateTypeProvider for={dateFields.map((x) => x.value)} />
          <Table
            noDataCellComponent={noDataCell}
            columnExtensions={tableColumnExtensions}
          />
          <TableColumnVisibility defaultHiddenColumnNames={[]} />
          <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
          <TableHeaderRow showSortingControls />
          <PagingPanel />
          <TableRowDetail contentComponent={RowDetail} />
        </Grid>
        {loading && <Loading />}
      </div>
    </div>
  );
}
