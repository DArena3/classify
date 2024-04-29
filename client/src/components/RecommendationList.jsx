import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const RecordCell = (props) => (
  <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
    {props.text}
  </td>
);

const Record = (props) => (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <RecordCell text={props.record.label}/>
      <RecordCell text={props.record.format}/>
      <RecordCell text={props.record.number}/>
      <RecordCell text={props.record.period}/>
      <RecordCell text={props.record.composer}/>
      <RecordCell text={props.record.work}/>
      <RecordCell text={props.record.performers}/>
      <RecordCell text={props.record.time}/>
    </tr>
);

export default function RecommendationList() {
    const [originalRecord, setOriginalRecord] = useState(false)
    const [records, setRecords] = useState([]);
    const [currentRecommendations, setCurrentRecommendations] = useState("composer")
  
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
      async function getOriginalRecord() {
        const id = params.id?.toString() || undefined;
        if (!id) return;
        const response = await fetch(
          `http://localhost:5050/record/${params.id.toString()}`
        );
        if (!response.ok) {
          const message = `An error has occurred: ${response.statusText}`;
          console.error(message);
          return;
        }
        const record = await response.json();
        if (!record) {
          console.warn(`Record with id ${id} not found`);
          navigate("/");
          return;
        }
        setOriginalRecord(record);
      }
      getOriginalRecord();
      console.log(originalRecord);
      return;
    }, []);

    // This method fetches the records from the database.
    useEffect(() => {
      async function getRecords() {
        const composerResponse = await fetch(`http://localhost:5050/record/recommendation/period/${params.id.toString()}`);
        if (!composerResponse.ok) {
          const message = `An error occurred: ${composerResponse.statusText}`;
          console.error(message);
          return;
        }
        const composerRecords = await composerResponse.json();
        // const records = {
        //   "magic": magicRecords,
        //   "composer": composerRecords,
        //   "period": artistRecords
        // }
        setRecords(composerRecords);
      }
      getRecords();
      return;
    }, []);
    
    // This method will map out the records of the recommendation on the table
    function recordList() {
        return records.map((record) => {
        return (
            <Record
            record={record}
            key={record._id}
            />
        );
        });
    }
    
    // This following section will display the table with the records of individuals.
    return (
        <>
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-red-700 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4 bg-red-800 text-white"
          to={`/`}
        >
          &lt; Go Back
        </Link>
        <h3 className="text-lg font-semibold">{ originalRecord ? `Recommendations for ${originalRecord.composer} - ${originalRecord.work}` : "Loading..."}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-60">Based on the piece you selected, you may like:</p>
        <div className="border rounded-lg overflow-hidden">
            <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&amp;_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                    Label
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                    Format
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                    Number
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                    Period
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                    Composer
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                    Work
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                    Performers
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                    Time
                    </th>
                  </tr>
                </thead>
                <tbody className="[&amp;_tr:last-child]:border-0">
                  {recordList()}
                </tbody>
            </table>
            </div>
        </div>
        </>
    );
}