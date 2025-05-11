import { useQuery } from '@tanstack/react-query';
import StudentCourses from "./StudentCourses"
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPostDate } from '../utils/date';
import LoadingSpinner from '../../components/LoadingSpinner';
const StudentCoursesScreen = () => {

  const { data, isLoading } = useQuery({
    queryKey: ["studentCourses"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/grades");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data.courses;
      } catch (error) {
        throw new Error(error);
      }
    }
  });

  const [semesterFilter, setSemesterFilter] = useState("");
  const filteredCourses = data?.filter((course) => course?.semester?.toLowerCase().includes(semesterFilter.toLowerCase()));

  const [viewModalData, setViewModalData] = useState(null);
  const { data: getClassmates, isLoading: gettingClassmates, refetch } = useQuery({
    queryKey: ["classmates"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/courses/${viewModalData?._id}/classmates`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    }
  });

  useEffect(() => {
    refetch();
  }, [refetch, viewModalData]);

  return (
    <div id="coursesContent" className="hidden-section w-full p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className='flex my-2'>
          <h2 className="relative left-1/2 -translate-x-1/2 text-2xl font-bold mb-6 text-center text-white">Subject Schedule</h2>
          <select
            onChange={(e) => setSemesterFilter(e.target.value)}
            className='rounded-md px-2 relative ml-auto'
            defaultValue={""}
          >
            <option value={""} disabled>Select Semester</option>
            <option value={""}>All Semester</option>
            <option>1st Semester</option>
            <option>2nd Semester</option>
            <option>Summer</option>
          </select>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses?.map((item) => (
                  <StudentCourses key={item._id} item={item} setViewModalData={setViewModalData} />
                ))}
                {!data?.length && (
                  <tr>
                    <td colSpan={10} className='text-center font-medium text-gray-700 p-10'>
                      Oops! No subjects are available right now.
                    </td>
                  </tr>
                )}
                {(!filteredCourses?.length && data?.length) && (
                  <tr>
                    <td colSpan={10} className='text-center font-medium text-gray-700 p-10'>
                      No subjects in this semester.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="viewCourseModal" className={`${viewModalData ? "block" : "hidden"} fixed z-10 inset-0 overflow-y-auto`}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Course Details - Introduction to Programming (CS 101)</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">Student ID</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">Student Name</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Joined Since</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200" id="studentTableBody">
                    {getClassmates?.map((classmate) => (
                      <tr key={classmate._id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{classmate?.student._id} </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{classmate?.student.firstName} {classmate?.student.middleName} {classmate?.student.lastName}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatPostDate(classmate?.student?.createdAt)} ago</td>
                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                          <div className="flex justify-center space-x-2">
                            <Link
                              to={`/profile/${classmate?.student?._id}`}
                              className="px-3 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600 transition edit-btn"
                              data-student-id="2023-001"
                              data-student-name="John Doe"
                              data-grade="1.25"
                              data-status="Passed"
                            >
                              View Profile
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {gettingClassmates && (
                      <tr>
                        <td colSpan={5}>
                          <p className='flex gap-2 justify-center items-center p-4'>
                            <LoadingSpinner size={20} /> Loading...
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* <!-- Course Info Section --> */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Course Information</h4>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Code:</span> CS 101</p>
                    <p className="text-sm"><span className="font-medium">Title:</span> Introduction to Programming</p>
                    <p className="text-sm"><span className="font-medium">Units:</span> 4</p>
                    <p className="text-sm"><span className="font-medium">Schedule:</span> Mon/Wed/Fri, 9:00 AM - 10:30 AM</p>
                    <p className="text-sm"><span className="font-medium">Room:</span> CS Building 205</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Name Statistics</h4>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Total Students: </span>{getClassmates?.length} </p>
                    <p className="text-sm"><span className="font-medium">Passing Rate:</span> 50%</p>
                    <p className="text-sm"><span className="font-medium">Average Grade:</span> 2.00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={() => setViewModalData(null)}
                type="button"
                className="closeModalBtn w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentCoursesScreen