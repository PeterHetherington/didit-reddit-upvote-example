import { auth } from "@/auth";
import ProfileForm from "@/components/ProfileForm";
import UserProfile from "@/components/UserProfile";
import { db } from "@/db";

export default async function Profile() {
  const session = await auth();

  const id = session.user.id;

  const res = await db.query(`SELECT * FROM user_profiles WHERE user_id = $1`, [
    id,
  ]);
  const userProfile = res.rows[0];

  if (!userProfile) {
    return (
      <div>
        <div>
          <p className="p-5 text-center">
            Before you can continue, you must finish setting up your profile
          </p>
        </div>
        <ProfileForm session={session} />
      </div>
    );
  }

  return (
    <div>
      <UserProfile session={session} bio={userProfile.bio} id={id} />
    </div>
  );
}
