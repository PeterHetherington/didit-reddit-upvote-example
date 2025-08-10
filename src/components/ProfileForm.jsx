import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function ProfileForm({ session }) {
  async function addUser(formData) {
    "use server";
    const { id, bio } = Object.fromEntries(formData);

    await db.query(`INSERT INTO user_profiles(user_id, bio) VALUES ($1, $2)`, [
      id,
      bio,
    ]);

    // revalidate the page to fetch new data
    revalidatePath(`/profile`);

    // redirect user
    redirect(`/profile`);
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4 bg-zinc-800 mt-10 rounded-xl">
      <form action={addUser} className="flex flex-col space-y-3">
        <h2 className="text-3xl mb-4 text-white">Profile set-up</h2>
        <input
          name="id"
          id="id"
          type="hidden"
          defaultValue={session.user.id}
        ></input>
        <textarea
          name="bio"
          id="bio"
          type="text"
          className="bg-white p-3 rounded-2xl"
          placeholder="About me"
          required
        ></textarea>
        <button
          type="submit"
          className="bg-green-400 px-4 py-2 text-xl text-black rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
}
