import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { formattedTime } from '../utils/date';
import Courses from './StudentCourses';
import { useAuthContext } from '../../context/authContext';
import StudentCoursesScreen from './StudentCoursesScreen';
import InstructorCoursesScreen from './InstructorCoursesScreen';

const CoursePage = () => {

  const {authUser} = useAuthContext();
  const studentAccess = authUser.role === "Student" ? true : false;

  return (
    <>
      {/* <!-- Courses Content --> */}
      {studentAccess ? <StudentCoursesScreen /> : <InstructorCoursesScreen />}
    </>
  )
}

export default CoursePage