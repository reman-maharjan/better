import { ModeSwitcher } from "@/components/ui/mode-switcher";
import { OrganizationSwitcher } from "../ui/organization-switcher";
import { getOrganization } from "@/server/organization"

export async function Header() {
  const { organizations } = await getOrganization();
  return (
   <header className="absolute top-0 right-0 flex justify-end items-center p-4">
    <OrganizationSwitcher organizations={organizations}/>
    <ModeSwitcher/>
    </header>
  )
}
