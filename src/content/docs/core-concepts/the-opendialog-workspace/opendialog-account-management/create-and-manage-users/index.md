---
title: Managing Users
---

Welcome to user management in OpenDialog! This guide shows you how to add and manage team members in your workspace. Your workspace starts with one user account, and you can easily add more team members as needed.

### :heavy\_plus\_sign: Adding a new user

To enable your team members to access the workspace, you will have to add them as users on your OpenDialog account.

:::note
Users are added to the workspace, not to a specific scenario.
:::

To do this, click on your name, the three dots next to it, and then click on User Management. Once there, click the Create button at the top right, complete the form, and click Create.

![](~/assets/screenshot-2025-07-11-at-17-09-31.png)

*The user creation screen*

Once you've set up the new user account, you need to notify the user directly since no email is automatically sent to inform them of the account setup.

**Instruct the user to:**

* Visit [cloud.opendialog.ai ](https://cloud.opendialog.ai/)
* Click on the 'I forgot my password' link and enter their email
* Await an email, then follow the instructions to set up their password and log in to the platform.

### Updating a user

To update user details, such as to change their [role](/core-concepts/the-opendialog-workspace/opendialog-account-management/create-and-manage-users#role-based-access-control), go to the User Management page within the application and click the pencil icon next to the user you want to edit. From this screen you can amend the user's name and their role.

![](~/assets/screenshot-2025-07-11-at-16-48-00.png)

*The user editing screen*

### Deleting a user

To remove a user from your instance, go to the User Management page within the application and click 'X' next to the user you want to remove. Then, click 'Yes' on the pop-up, and the user will be removed.

![User profile - Delete/Edit buttons](~/assets/image-149.png)

OpenDialog uses a role-based access control system to manage access within workspaces. This system ensures that users have access only to the tools and information they need, based on their assigned roles.

### Role-based access control

Roles and access levels in OpenDialog are managed on a per-workspace basis. This means a user can have different roles across different workspaces. Each role provides access to different parts of the platform, depending on the responsibilities typically associated with that role.

#### Admin

Users with the Admin role have full control over the workspace. They can:

* Access both the Analyse and Preview features for all scenarios.
* Manage all workspace resources, including scenarios, language services, and dynamic attributes.
* Create, view, update, and delete any user within the workspace.

#### Editor

Editors have access to all the tools needed to build and maintain content within the workspace. They can:

* Access the Analyse and Preview features for all scenarios.
* Manage workspace resources such as scenarios, language services, and dynamic attributes.
* They cannot manage users.

#### Preview Guest

This role is intended for users who only need to test scenarios. They can:

* Access the Preview feature for all scenarios.
* They cannot access Analyse, manage resources or users.

#### Analyse Guest

This role is suitable for users who need to review conversation data. They can:

* Access the Analyse feature for all scenarios.
* They cannot access Preview, manage resources, or users.

#### Analyse & Preview Guest

This role is intended for users who only need to test scenarios and review conversation data. They can:

* Access both the Analyse and Preview features for all scenarios.
* They cannot manage resources or users.

### Protections

To protect user accounts and prevent unauthorised access or manipulation, OpenDialog enforces rules around user management. This ensures:

#### If a user has the Admin role:

* They can create, read, update\*, or delete any user within the workspace.

#### If a user does not have the Admin role:

* They can read and update\* only their own user profile.

\*When updating a user:

* Users cannot assign roles to themselves, even when editing their own profile. This prevents someone from elevating their own access to Admin.
* Users cannot change login credentials for other users, preventing impersonation or unauthorised access.
