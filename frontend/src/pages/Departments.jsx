import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { Icon } from "../components/Icons";
import { api } from "../services/api";

const Departments = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getEmployees()
      .then(({ employees: rows }) => setEmployees(rows))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(() => {
    const grouped = employees.reduce((result, employee) => {
      const key = employee.department || "Unassigned";
      result[key] = result[key] || { department: key, count: 0, salary: 0 };
      result[key].count += 1;
      result[key].salary += Number(employee.salary || 0);
      return result;
    }, {});

    return Object.values(grouped);
  }, [employees]);

  return (
    <main className="app-shell">
      <Navbar active="Departments" />
      <section className="content">
        <header className="page-header">
          <div>
            <span className="plain-icon"><Icon name="building" /></span>
            <h1>Departments</h1>
          </div>
        </header>

        <section className="detail-card">
          {error && <div className="alert">{error}</div>}
          {loading ? (
            <Loader />
          ) : departments.length ? (
            <div className="department-grid">
              {departments.map((department) => (
                <article key={department.department}>
                  <span className="stat-icon blue"><Icon name="building" /></span>
                  <div>
                    <h2>{department.department}</h2>
                    <p>{department.count} employee{department.count === 1 ? "" : "s"}</p>
                    <strong>
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(department.salary)}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state compact">No departments found.</div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Departments;
