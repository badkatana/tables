import { Box, Tab, Tabs, Typography } from "@mui/material";
import "./App.css";
import { UserTable } from "./components/user/UserTable";
import { SyntheticEvent, useState } from "react";
import { RoleTable } from "./components/roles/RoleTable";
import { useQuery } from "react-query";
import { getRoles, getUsers } from "./http/functions";
import { IUser } from "./interfaces/User";
import { IRole } from "./interfaces/IRole";

function TabsProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function App() {
  const [selectedTab, setSelectedTab] = useState(0);

  const { data, error, isLoading } = useQuery<IUser[], Error>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const {
    data: roles,
    error: rolesError,
    isLoading: rolesLoading,
  } = useQuery<IRole[], Error>({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const handleChange = (e: SyntheticEvent, value: any) => {
    setSelectedTab(value);
  };

  if (isLoading || rolesLoading) {
    return (
      <Box>
        <Typography>Please wait...</Typography>
      </Box>
    );
  }

  if (error || rolesError) {
    return (
      <Box>
        <Typography>Error getting users</Typography>
        <Typography>
          {error
            ? `Error fetching users: ${error.message}`
            : `Error fetching roles: ${rolesError?.message}`}
        </Typography>
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
      {selectedTab === 0 ? (
        <UserTable />
      ) : (
        <RoleTable projectName="smthg" users={data!} />
      )}
    </Box>
  );
}

export default App;
