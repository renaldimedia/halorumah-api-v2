import Role from "./roles.enum";
const roleDisplay = {};


// Object.entries(Role).forEach(([key,val]) => {
    roleDisplay[Role.AGENT] = "Agen";
    roleDisplay[Role.AGENCY] = "Agensi";
    roleDisplay[Role.ADMIN] = "Admin";
    roleDisplay[Role.OWNER] = "Home Owner";
    roleDisplay[Role.USER] = "Member";
    roleDisplay[Role.DEVELOPER] = "Pengembang";
    roleDisplay[Role.MEMBER] = "Member";
// });

export default roleDisplay;

