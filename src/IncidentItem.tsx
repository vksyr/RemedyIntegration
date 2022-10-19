import * as React from "react";
import { FunctionComponent, useEffect, useState } from "react";
import { Loading } from "./loading";
import moment from "moment";

interface IncidentItemProps {
  incidentNumber: string;
}

export interface WorkLogDto {
  Work_Log_Submit_Date?: string | null;
  Work_Log_Submitter?: string | null;
  Detailed_Description?: string | null;
}

export interface IncidentItemDto {
  Description?: string | null;
  PriorityCode?: string | null;
  Detailed_Decription?: string | null;
  First_Name?: string | null;
  Last_Name?: string | null;
  Department?: string | null;
  StatusCode?: string | null;
  Assigned_Group?: string | null;
  WorkLog?: WorkLogDto[] | null;
}

const IncidentItem: FunctionComponent<IncidentItemProps> = (props) => {
  const dataSiteUrl = "data/";
  const [loading, setLoading] = useState(false);
  const [row, setRow] = useState<IncidentItemDto>({});

  const dateFormatter = (epoch: number) => {
    return moment.unix(epoch).local().format("MM/DD/YYYY"); // 01/11/2021
  };

  const getIncident = () => {
    console.log("getIncidents");
    setRow({});
    setLoading(true);

    fetch(
      `${dataSiteUrl}incident.json?opCode=GetIncident&IncidentNumber=${props.incidentNumber}`,
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
        setRow(myJson.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    getIncident();
  }, [props.incidentNumber]);

  return (
    <div className="row" style={{ maxWidth: "calc(100vw)" }}>
      <div
        className="col-6"
        style={{
          maxHeight: 300,
          overflowY: "auto",
          marginBottom: -15,
          marginTop: -15,
          paddingTop: 11,
          paddingBottom: 11
        }}
      >
        <div className="detail-field">
          <strong>Summary:</strong>
          <br />
          {row.Description}
        </div>
        <div className="detail-field">
          <strong>Priority:</strong>
          <br />
          {row.PriorityCode}
        </div>
        <div className="detail-field">
          <strong>Notes:</strong>
          <br />
          {row.Detailed_Decription}
        </div>
        <div className="detail-field">
          <strong>Customer/Office:</strong>
          <br />
          {row.First_Name} {row.Last_Name} / {row.Department}
        </div>
        <div className="detail-field">
          <strong>Status:</strong>
          <br />
          {row.StatusCode}
        </div>
        <div className="detail-field">
          <strong>Assigned Group:</strong>
          <br />
          {row.Assigned_Group}
        </div>
      </div>
      {row.WorkLog && (
        <div
          className="col-6"
          style={{
            maxHeight: 300,
            overflowY: "auto",
            borderLeft: "1px solid #ced4da",
            marginBottom: -15,
            marginTop: -15,
            paddingTop: 11,
            paddingBottom: 11
          }}
        >
          <div style={{ padding: 3 }}>
            <b>LOG:</b>
          </div>
          <div>
            {row.WorkLog?.map(function (item, i) {
              return (
                <div
                  className="detail-field"
                  style={{
                    borderBottom: "1px solid #ced4da"
                  }}
                >
                  <div className="worklog-header">
                    <strong>
                      {dateFormatter(
                        parseInt(item.Work_Log_Submit_Date || "0")
                      )}
                    </strong>{" "}
                    {item.Work_Log_Submitter}
                  </div>
                  <div className="worklog-body">
                    {item.Detailed_Description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {loading && <Loading />}
    </div>
  );
};

export default IncidentItem;
