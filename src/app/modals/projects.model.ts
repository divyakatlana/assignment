export class Projects {
    data: Project[]
}

export class Project {
    projectId: string;
    userIds: string[];
    rule: string;
    gatewayIds: string[];
    structure: string;
    industry: string;
    website: string;
    description: string;
    image: string;
    name: string;

    constructor(projectId: string, name: string) {
        this.projectId = projectId;
        this.name = name;
    }
}

export class projectResponse {
    projectId: string;
    name: string;

}