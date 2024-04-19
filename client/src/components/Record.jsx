import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
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
      setForm(record);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };
    try {
      let response;
      if (isNew) {
        // if we are adding a new record we will POST to /record.
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        // if we are updating a record we will PATCH to /record/:id.
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    } finally {
      setForm({ name: "", position: "", level: "" });
      navigate("/");
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
      <Link
        className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-red-700 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4 bg-red-800 text-white"
        to={`/`}
      >
        &lt; Go Back
      </Link>
      <h3 className="text-lg font-semibold p-4">{isNew ? "Create Piece" : "Update Piece"}</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Piece Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Label: The record label of the piece
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Format: CD or LP
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Number: The catalog number of the CD or LP
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Period: 0-6, depending on who composed the piece and what era of classical music they composed in
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Composer: Last, First (unless they are well-known, in which case just use their last name)
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Work: The name of the piece
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Performers: Last names only, order by soloists, then conductor, then ensemble
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Time: Duration of the piece, in minutes
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="label"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Label
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="label"
                    id="label"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Chandos"
                    value={form.label}
                    onChange={(e) => updateForm({ label: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="format"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Format
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="format"
                    id="format"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="CD"
                    value={form.format}
                    onChange={(e) => updateForm({ format: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="number"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Number
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="number"
                    id="number"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="CD CHAN 1234"
                    value={form.number}
                    onChange={(e) => updateForm({ number: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div>
              <fieldset className="mt-4">
                <legend className="block text-sm font-medium leading-6 text-slate-900">Period</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  <div className="flex items-center">
                    <input
                      id="period0"
                      name="positionOptions"
                      type="radio"
                      value="0"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.period === "0" || form.period === 0}
                      onChange={(e) => updateForm({ period: e.target.value })}
                    />
                    <label
                      htmlFor="period0"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      0
                    </label>
                    <input
                      id="period1"
                      name="positionOptions"
                      type="radio"
                      value="1"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.period === "1" || form.period === 1}
                      onChange={(e) => updateForm({ period: e.target.value })}
                    />
                    <label
                      htmlFor="period1"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      1
                    </label>
                    <input
                      id="period2"
                      name="positionOptions"
                      type="radio"
                      value="2"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.period === "2" || form.period === 2}
                      onChange={(e) => updateForm({ period: e.target.value })}
                    />
                    <label
                      htmlFor="period2"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      2
                    </label>
                    <input
                      id="period3"
                      name="positionOptions"
                      type="radio"
                      value="3"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.period === "3" || form.period === 3}
                      onChange={(e) => updateForm({ period: e.target.value })}
                    />
                    <label
                      htmlFor="period0"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      3
                    </label>
                    <input
                      id="period0"
                      name="positionOptions"
                      type="radio"
                      value="4"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.period === "4" || form.period === 4}
                      onChange={(e) => updateForm({ period: e.target.value })}
                    />
                    <label
                      htmlFor="period0"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      4
                    </label>
                    <input
                      id="period5"
                      name="positionOptions"
                      type="radio"
                      value="5"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.period === "5" || form.period === 5}
                      onChange={(e) => updateForm({ period: e.target.value })}
                    />
                    <label
                      htmlFor="period5"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      5
                    </label>
                    <input
                      id="period6"
                      name="positionOptions"
                      type="radio"
                      value="6"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={form.period === "6" || form.period === 6}
                      onChange={(e) => updateForm({ period: e.target.value })}
                    />
                    <label
                      htmlFor="period6"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      6
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="composer"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Composer
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="composer"
                    id="composer"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Beethoven"
                    value={form.composer}
                    onChange={(e) => updateForm({ composer: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="work"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Work
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="work"
                    id="work"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Sonata For Violin and Piano in C Major"
                    value={form.work}
                    onChange={(e) => updateForm({ work: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="performers"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Performers
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="performers"
                    id="performers"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Ma, Ax"
                    value={form.performers}
                    onChange={(e) => updateForm({ performers: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="time"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Time (minutes)
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="time"
                    id="time"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="28.1"
                    value={form.time}
                    onChange={(e) => updateForm({ time: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Piece"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}