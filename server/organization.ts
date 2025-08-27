"use server";

import { db } from "@/db/drizzle";
import { member, organization } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { getCurrentUser } from "./users";

export async function getOrganization(){
const { currentUser } = await getCurrentUser()

const members=await db.query.member.findMany({
    where: eq(member.userId, currentUser.id),
})

const organizations=await db.query.organization.findMany({
    where: inArray(organization.id, members.map((member)=>member.organizationId)),
})
return {currentUser,organizations}
}