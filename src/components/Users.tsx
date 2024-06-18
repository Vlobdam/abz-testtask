import { UserGrid } from './UserGrid';
import { Button } from './Button';
import { Heading } from './Heading';
import { User } from '@/types/User';
import buttonStyles from '@/styles/Button.module.scss';
import { Loader } from './Loader';
type Props = {
  currentUsers: User[],
  currentPage: number,
  isLoading: boolean,
  totalPages: number,
  loadNext: () => void
}

export const Users = ({
    currentUsers,
    currentPage,
    isLoading,
    totalPages,
    loadNext,
  }: Props) => {
  return (
    <>
      <Heading>Working with GET request</Heading>
      {
        currentUsers.length > 0 && <UserGrid users={currentUsers} />
      }
      
      {
        isLoading && <Loader />
      }

      <Button 
        handleClick={() => loadNext()} 
        isActive={currentPage < totalPages || totalPages === -1} 
        color="primary"
        className={buttonStyles.buttonBig}
      >
        Show more
      </Button>
    </>
    );
}