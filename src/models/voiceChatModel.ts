export class VoiceChatModel {
    id: string;
    owner: string;
    createdAt: Date;
    limit: number | null;
    constructor(id: string, owner: string, createdAt: Date, limit: number | null) {
        this.id = id;
        this.owner = owner;
        this.createdAt = createdAt;
        this.limit = limit;
    }
}