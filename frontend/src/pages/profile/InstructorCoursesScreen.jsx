import { useQuery } from '@tanstack/react-query';
import InstructorCourses from './InstructorCourses';
import LoadingSpinner from '../../components/LoadingSpinner';

const InstructorCoursesScreen = () => {

  const { data, isLoading } = useQuery({
    queryKey: ["instructorCourses"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/courses");
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


  if(isLoading) {
    return (
      <div className='h-full w-full flex justify-center items-center my-auto'>
        <LoadingSpinner size={50}/>
      </div>
    )
  }

  return (
    <div id="coursesContent" className="hidden-section w-full p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Subject Schedule</h2>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.map((item) => (
                  <InstructorCourses key={item._id} item={item} />
                ))}
                {!data && (
                  <tr>
                    <td colSpan={7} className='text-center font-medium text-gray-700 p-10'>
                      Oops! No subjects are available right now.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorCoursesScreen