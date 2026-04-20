import { ChevronDownIcon } from "./icons";

export default function SelectField({ className = "", children, ...props }) {
  const shellClassName = className ? `select-shell ${className}` : "select-shell";

  return (
    <label className={shellClassName}>
      <select {...props}>{children}</select>
      <span className="select-icon" aria-hidden="true">
        <ChevronDownIcon />
      </span>
    </label>
  );
}
