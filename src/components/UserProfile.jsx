import Image from "next/image";
import { db } from "@/db";
import Link from "next/link";

export default async function UserProfile({ session, bio, id }) {
  const { rows: posts } = await db.query(
    `SELECT posts.id, posts.title, posts.body, posts.created_at, users.name, 
      COALESCE(SUM(votes.vote), 0) AS vote_total
       FROM posts
       JOIN users ON posts.user_id = users.id
       LEFT JOIN votes ON votes.post_id = posts.id
       WHERE posts.user_id = $1
       GROUP BY posts.id, users.name
       ORDER BY vote_total DESC`,
    [id]
  );
  console.log(posts);
  return (
    <>
      <div className="flex p-3 items-center justify-center">
        <Image
          src={session.user.image}
          width={200}
          height={200}
          alt="profile picture"
          className=""
        />
      </div>
      <div className="flex p-3 items-center justify-center">
        <h2>{session.user.name}</h2>
      </div>
      <div className="flex p-3 items-center justify-center text-center">
        <p>{bio}</p>
      </div>
      <div>
        <ul className="max-w-screen-lg mx-auto p-4 mb-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className=" py-4 flex space-x-6 hover:bg-zinc-200 rounded-lg"
            >
              <div>
                <Link
                  href={`/post/${post.id}`}
                  className="text-3xl hover:text-pink-500"
                >
                  {post.title}
                </Link>
                <p className="text-zinc-700">posted by {post.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
