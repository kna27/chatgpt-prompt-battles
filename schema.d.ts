/*
    These are the formats of the objects passed around
    internally on the server / DB
*/

declare interface ChallengeMetadata {
    /** Challenge max name length is 24 */
    public name: string;
    /** Challenge max description length is 256 */
    public description: string;
    /** Challenge max prompt length is 512 */
    public prompt: string;
    /** Will change based on number of solves - cached here */
    public scoreValue: number;
}

declare interface Challenge extends ChallengeMetadata {
    /** Primary key in DB; Identifies Challenge */
    public id: number;
    /** Creator's User.Id */
    public creator: string;
}


declare interface UserSettings {
    /** User max name length is 24 */
    public name: string;
    /** Max length is 50, does not need to be set */
    public openAiKey: string;
}

declare interface UserMetadata extends UserSettings {
    /**
     * [UNIQUE] Allows use to find Users
     * using their auth0 `user_id` property
     */
    public auth0UserKey: string;
}

declare interface User extends UserMetadata {
    /** Primary key in DB; Identifies User */
    public id: number;


    /** Will change based on value of solves - cached here */
    public score: number;
}



declare interface Solve {
    // TODO: It'd be cool to collect this data, but there'
    // no way to make sure they actually used this payload
    // so keep it disabled for now

    // /** Whatever the user submitted to get the password */
    // public payload: string;

    /** Foreign Key; References User.id */
    public userId: number;

    /** Foreign Key; References Challenge.id */
    public challengeId: number;
}

