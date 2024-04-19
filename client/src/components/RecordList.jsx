import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CopyButton = (props) => {
  return ( 
    <button
      type="button"
      display="none"
    >
      Copy
    </button>
  )
}

const RecordCell = (props) => {
  const [hidden, setHidden] = useState(true)
  return (
    <td 
      className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0" 
      onMouseOver={() => setHidden(false)}
      onMouseLeave={() => setHidden(true)}
    >
        {props.text}&emsp;
        {/* <CopyButton hidden={hidden}></CopyButton> */}
    </td>
  )
}

const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <RecordCell text={props.record.label}></RecordCell>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.format}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.number}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.period}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.composer}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.work}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.performers}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.time}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/recommendation/${props.record._id}`}
        >
          Get Recommendations
        </Link>
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 bg-red-50"
          type="button"
          onClick={() => {
            props.deleteRecord(props.record._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/record/limited`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    getRecords();
    return;
  }, [records.length]);

  // This method will delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/record/${id}`, {
      method: "DELETE",
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // This method will map out the records on the table
  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <>
      <p className="text-lg font-semibold p-4"><b>Catalog</b>: currently showing first 50 results</p>
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
                  Time (mins)
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Actions
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