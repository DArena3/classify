import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

const RecordCell = (props) => {
  const [hidden, setHidden] = useState(true)
  return (
    <td 
      className="p-3 align-middle [&amp;:has([role=checkbox])]:pr-0" 
      onClick={() => setHidden(false)}
    >
        {props.text}
    </td>
  )
}

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
    <td className="p-3 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3 bg-slate-200 text-black"
          to={`/recommendation/${props.record._id}`}
        >
          Get Recommendations
        </Link>
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-400 h-9 rounded-md px-3 bg-slate-500 text-white"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-red-700 hover:text-accent-foreground h-9 rounded-md px-3 bg-red-800 text-white"
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
  const [first, setFirst] = useState(true);
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [form, setForm] = useState({
    queryText: "",
    searchField: "*",
  });

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const query = { ...form };
    setRecordsLoading(true);
    setPageNumber(1);
    try {
      let response;
      response = await fetch("http://localhost:5050/record/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newRecords = await response.json();
      console.log(newRecords)
      setRecords(newRecords);
      setRecordsLoading(false);
      console.log("1")
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
      setRecords(records)
      console.log("2")
    }
  }

  function getMaxPages() {return records.length % pageSize === 0 ? Math.floor(records.length / pageSize) : Math.floor(records.length / pageSize) + 1}

  function validateUpdatePageNumber(input) {
    if (input === '') {
      setPageNumber(1)
      return;
    }
    const inputNumber = parseInt(input)
    const maxPages = getMaxPages()
    if (inputNumber >= 1 && inputNumber <= maxPages) {
      setPageNumber(inputNumber)
    }
  }

  function validateUpdatePageSize(input) {
    const inputNumber = parseInt(input)
    if (inputNumber >= 1 && inputNumber <= records.length) {
      setPageSize(inputNumber)
    }
    if (pageNumber > getMaxPages()) {
      setPageNumber(getMaxPages())
    }
  }

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/record`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
      setRecordsLoading(false);
      setFirst(false)
    }
    if (first) {
      getRecords()
      console.log("1")
    }
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
  function recordList(pageNumber, pageSize) {
    const start = (pageNumber - 1) * pageSize;
    const end = Math.min(start + pageSize, records.length + 1)
    const pagedRecords = records.slice(start, end)
    return pagedRecords.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  const ColumnHeader = (props) => (
    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hover:bg-slate-100 [&amp;:has([role=checkbox])]:pr-0">
      {props.text}
    </th>
  )

  // This following section will display the table with the records of individuals.
  return (
    <>
      <h2 className="text-lg font-semibold p-4"><span className="font-bold">View Catalog</span></h2>
      {recordsLoading ? 
        <p className="text-md p-2 ml-4 m-2">Loading...</p> :
        <form className="ml-4">
          <button
            className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-red-700 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mr-4 bg-red-800 text-white"
            type="button"
            onClick={() => validateUpdatePageNumber(pageNumber - 1)}
          >
            &lt; Previous Page
          </button>
          Page
          <input
            className="border rounded-md w-16 h-10 text-md p-2 ml-4 m-2 text-slate-900 placeholder:text-slate-400"
            type="number"
            value={pageNumber}
            onChange={(e) => validateUpdatePageNumber(e.target.value)}
          >
          </input>
          of {getMaxPages()}
          <button
            className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-red-700 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer ml-4 bg-red-800 text-white"
            type="button"
            onClick={() => validateUpdatePageNumber(pageNumber + 1)}
          >
            Next Page &gt;
          </button>
          <span className="float-right">
            Showing
            <input
              className="border rounded-md w-16 h-10 text-md p-2 ml-4 m-2 text-slate-900 placeholder:text-slate-400"
              type="number"
              value={pageSize}
              onChange={(e) => validateUpdatePageSize(e.target.value)}
            >
            </input>
            entries per page
          </span>
        </form>
      }
      <form onSubmit={onSubmit}>
        <input 
          className="border rounded-md w-11/12 h-10 text-md p-2 mt-4 ml-4 mr-4 text-slate-900 placeholder:text-slate-400"
          type="text"
          placeholder="Search the catalog..."
          value={form.queryText}
          onChange={(e) => updateForm({ queryText: e.target.value })}
        ></input>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-red-700 hover:text-accent-foreground h-9 rounded-md px-3 bg-red-800 text-white"
          type="submit"
        >
          Search
        </button>
        <fieldset className="ml-4 mb-4 mt-1">
          <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
            <div className="flex items-center">
              <p className="font-semibold">Field to search:&nbsp;&nbsp;</p>
              <input
                id="all"
                name="fieldOptions"
                type="radio"
                value="*"
                className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                checked={form.searchField === "*"}
                onChange={(e) => updateForm({ searchField: e.target.value })}
              />
              <label
                htmlFor="all"
                className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
              >
                ALL
              </label>
              <input
                id="composer"
                name="fieldOptions"
                type="radio"
                value="composer"
                className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                checked={form.searchField === "composer"}
                onChange={(e) => updateForm({ searchField: e.target.value })}
              />
              <label
                htmlFor="composer"
                className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
              >
                Composer
              </label>
              <input
                id="work"
                name="fieldOptions"
                type="radio"
                value="work"
                className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                checked={form.searchField === "work"}
                onChange={(e) => updateForm({ searchField: e.target.value })}
              />
              <label
                htmlFor="work"
                className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
              >
                Work
              </label>
              <input
                id="performers"
                name="fieldOptions"
                type="radio"
                value="performers"
                className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                checked={form.searchField === "performers"}
                onChange={(e) => updateForm({ searchField: e.target.value })}
              />
              <label
                htmlFor="performers"
                className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
              >
                Performers
              </label>
            </div>
          </div>
        </fieldset>
      </form>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <ColumnHeader text="Label"/>
                <ColumnHeader text="Format"/>
                <ColumnHeader text="Number"/>
                <ColumnHeader text="Period"/>
                <ColumnHeader text="Composer"/>
                <ColumnHeader text="Work"/>
                <ColumnHeader text="Performers"/>
                <ColumnHeader text="Time (mins)"/>
                <ColumnHeader text="Actions"/>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {recordsLoading ?
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle text-center text-md [&amp;:has([role=checkbox])]:pr-0" colSpan="9">Loading...</td>
              </tr> :
              recordList(pageNumber, pageSize)}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}