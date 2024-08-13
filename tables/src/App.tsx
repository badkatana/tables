import { Box, Tab, Tabs, Typography } from "@mui/material";
import "./App.css";
import { UserTable } from "./components/user/UserTable";
import { SyntheticEvent, useState } from "react";
import { RoleTable } from "./components/roles/RoleTable";
import useUser from "./hooks/useUser";
import { useRoles } from "./hooks/useRoles";

function TabsProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const { error, isLoading } = useUser();
  const { rolesError, rolesLoading } = useRoles();

  const handleChange = (e: SyntheticEvent, value: any) => {
    setSelectedTab(value);
  };

  if (isLoading) {
    return (
      <Box>
        <Typography>Please wait...</Typography>
      </Box>
    );
  }
  if (rolesLoading) {
    return (
      <Box>
        <Typography>Please wait...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography>Error getting users</Typography>
        <Typography>`Error fetching users: ${error.message}`</Typography>
      </Box>
    );
  }

  if (rolesError) {
    return (
      <Box>
        <Typography>Error getting users</Typography>
        <Typography>`Error fetching roles: ${rolesError.message}`</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="People" {...TabsProps(0)} />
            <Tab label="Roles" {...TabsProps(1)} />
          </Tabs>
        </Box>
      </Box>
      {selectedTab === 0 ? <UserTable /> : <RoleTable />}
    </Box>
  );
}

export default App;
