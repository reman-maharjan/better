import {createAccessControl} from "better-auth/plugins/access"

const statement={
    project: ["create","share","update","delete"],
}as const;

const ac=createAccessControl(statement);

const member=ac.newRole({
    project:["create"],
})

const admin=ac.newRole({
    project:["create","share","update","delete"],
})

const owner=ac.newRole({
    project:["create","share","update","delete"],
})


export {member,admin,owner,ac, statement}