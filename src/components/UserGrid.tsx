import { User } from "@/types/User";
import { UserItem } from "./UserItem";
import styles from "@/styles/UserGrid.module.scss";

export const UserGrid = ({users}: {users: User[]}) => (
  <div className={styles.grid}>
    {users.map((user) => (
      <UserItem key={user.id} user={user} />
    ))} 
  </div>
)