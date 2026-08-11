const Loader = ({ label = "Loading" }) => (
  <div className="loader" role="status" aria-live="polite">
    <span></span>
    {label}
  </div>
);

export default Loader;
