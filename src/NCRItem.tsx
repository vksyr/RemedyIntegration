import * as React from "react";
import { FunctionComponent, useEffect, useState } from "react";
import { Loading } from "./loading";
import moment from "moment";

interface NCRItemProps {
  infrastructureChangeID: string;
}

export interface WorkLogDto {
  Work_Log_Submit_Date?: string | null;
  Work_Log_Submitter?: string | null;
  Detailed_Description?: string | null;
}

export interface NCRItemDto {
  Site_Group?: string | null;
  bmc_Security_Classification?: string | null;
  Change_Request_Status?: string | null;
  Description?: string | null;
  Detailed_Description?: string | null;
  ChangeCoordinatorGroup?: string | null;
  Submitter?: string | null;
  Approved?: string | null;
  Created?: string | null;
  Modified?: string | null;
  WorkLog?: WorkLogDto[] | null;
}

const NCRItem: FunctionComponent<NCRItemProps> = (props) => {
  const dataSiteUrl = "data/";
  const [loading, setLoading] = useState(false);
  const [row, setRow] = useState<NCRItemDto>({});

  const dateFormatter = (epoch: number) => {
    return moment.unix(epoch).local().format("MM/DD/YYYY"); // 01/11/2021
  };

  const getNCRItem = () => {
    console.log("getNCRItem");
    setRow({});
    setLoading(true);

    fetch(
      `${dataSiteUrl}NCRItem.json?opCode=GetNCRItem&InfrastructureChangeID=${props.infrastructureChangeID}`,
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
    getNCRItem();
  }, [props.infrastructureChangeID]);

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
          <strong>Change Location:</strong>
          <br />
          {row.Site_Group}
        </div>
        <div className="detail-field">
          <strong>Security Classification:</strong>
          <br />
          {row.bmc_Security_Classification}
        </div>
        <div className="detail-field">
          <strong>Status:</strong>
          <br />
          {row.Change_Request_Status}
        </div>
        <div className="detail-field">
          <strong>Summary:</strong>
          <br />
          {row.Description}
        </div>
        <div className="detail-field">
          <strong>Notes:</strong>
          <br />
          {row.Detailed_Description}
        </div>
        <div className="detail-field">
          <strong>Change Coordinator / Change Group:</strong>
          <br />
          {row.ChangeCoordinatorGroup}
        </div>
        <div className="detail-field">
          <strong>Submitter / Office:</strong>
          <br />
          {row.Submitter}
        </div>
        <div className="detail-field">
          <strong>Approved:</strong>
          <br />
          {row.Approved}
        </div>
        <div className="detail-field">
          <strong>Created:</strong>
          <br />
          {row.Created}
        </div>
        <div className="detail-field">
          <strong>Modified:</strong>
          <br />
          {row.Modified}
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

export default NCRItem;
