"use client";

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import {Organization} from "../../db/schema";
import { toast } from "sonner";

interface OrganizationSwitcherProps{
    organizations: Organization[]
}

export function OrganizationSwitcher({ organizations }: OrganizationSwitcherProps) {
    const {data:activeOrganization}=authClient.useActiveOrganization()
    const [isSwitching, setIsSwitching] = useState(false);

    const handleChangeOrganization = async (organizationId: string) => {
        if (isSwitching || organizationId === activeOrganization?.id) return;
        
        setIsSwitching(true);

        try {
            await authClient.organization.setActive({
                organizationId,
            });

            toast.success("Organization switched successfully");
        } catch (error) {
            console.error('Error switching organization:', error);
            toast.error(
                error instanceof Error ? error.message : 'Failed to switch organization'
            );
            // Optionally force a page refresh if the switch fails
            // window.location.reload();
        } finally {
            setIsSwitching(false);
        }
    }
    
    return (
        <Select 
            onValueChange={handleChangeOrganization} 
            value={activeOrganization?.id}
            disabled={isSwitching}
        >
            <SelectTrigger>
                <SelectValue placeholder={isSwitching ? 'Switching...' : 'Select an organization'} />
            </SelectTrigger>
            <SelectContent>
               {organizations.map((organization)=>(
                <SelectItem 
                    key={organization.id} 
                    value={organization.id}
                    disabled={isSwitching || organization.id === activeOrganization?.id}
                >
                    {organization.name} {organization.id === activeOrganization?.id && '(Active)'}
                </SelectItem>
               ))}

            </SelectContent>
        </Select>
    )
}
