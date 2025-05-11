import { useAuthContext } from '../../context/authContext';
import StudentCoursesScreen from './StudentCoursesScreen';
import InstructorCoursesScreen from './InstructorCoursesScreen';

const HomePage = () => {

  const {authUser} = useAuthContext();
  const studentAccess = authUser?.role === "Student" ? true : false;

  return (
    <>
      {/* <!-- Courses Content --> */}
      {studentAccess ? <StudentCoursesScreen /> : <InstructorCoursesScreen />}
    </>
  )
}

export default HomePage