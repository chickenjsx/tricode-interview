function RoleSwitcher({ currentRole, onRoleChange }) {
  const roles = ["User", "Director", "Exec"];

  return (
    <div className="role-switcher">
      <h3>
        Current Role: <span className="current-role">{currentRole}</span>
      </h3>
      <div className="role-buttons">
        {roles.map((role) => (
          <button
            key={role}
            className={`role-btn ${currentRole === role ? "active" : ""}`}
            onClick={() => onRoleChange(role)}
          >
            {role}
          </button>
        ))}
      </div>
      <p className="role-description">
        {currentRole === "User" && "Users can create expenses"}
        {currentRole === "Director" &&
          "Directors can create and approve/deny expenses"}
        {currentRole === "Exec" &&
          "Executives can create and approve/deny expenses"}
      </p>
    </div>
  );
}

export default RoleSwitcher;
