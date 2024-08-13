import { Box, Select, MenuItem, Button } from "@mui/material";
import { useRoles } from "../../../hooks/useRoles";
import { useState } from "react";

type UserRoleSelectProps = {
  handleSelectionEvent: (selectedRole: string) => void;
  handleCanselEvent: (value: {}) => void;
};
export const UserRoleSelect = (props: UserRoleSelectProps) => {
  const { roles } = useRoles();
  const [selectedRole, setSelectedRole] = useState(roles![0].roleName || "");

  return (
    <Box>
      <Select defaultValue={roles[0].roleName}>
        {roles.map((role) => (
          <MenuItem
            value={role.roleName}
            onClick={() => setSelectedRole(role.roleName)}
          >
            {role.roleName}
          </MenuItem>
        ))}
      </Select>
      <Button
        onClick={(e) => {
          props.handleSelectionEvent(selectedRole);
          setSelectedRole(roles![0].roleName);
        }}
      >
        Confirm
      </Button>
      <Button onClick={(e) => props.handleCanselEvent({})}>Cancel</Button>
    </Box>
  );
};
