import pb from "../pocketbase";

export default async function createUser(userID: string) {
    const existing = await pb
        .collection("social_credit_people")
        .getFirstListItem(`user_id="${userID}"`)
        .catch(() => null);

    if (!existing) {
        const user = await pb.collection("social_credit_people").create({ user_id: userID });
        return { user, created: true };
    }

    return { user: existing, created: false };
}
