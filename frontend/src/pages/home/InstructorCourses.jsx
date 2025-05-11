import { formattedTime } from '../utils/date';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toTitleFormat } from '../utils/text';

const InstructorCourses = ({ item, setSelectedItem, setViewModalData }) => {

  const startTime = formattedTime(item.startTime);
  const endTime = formattedTime(item.endTime);

  const queryClient = useQueryClient();

  const {mutate, isPending} = useMutation({
    mutationKey: ["deleteCourse"],
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/courses/${item._id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if(!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        queryClient.invalidateQueries({ queryKey: ["instructorCourses"]});
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  return (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.code.toUpperCase()}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{toTitleFormat(item.title)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.units}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.yearLevel}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.semester}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.room.toUpperCase()}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.day}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{startTime}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{endTime}</td>
        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setViewModalData(item)}
              className="px-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition viewBtn"
            >
              View
            </button>
            <button
              onClick={() => setSelectedItem(item)} 
              className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition editBtn"
              data-code="CS 101" data-title="Introduction to Programming" data-units="4"
              data-year="1st Year" data-semester="1st Semester" data-room="CS Building 205"
              data-day="Mon/Wed/Fri" data-start="09:00" data-end="10:30"
            >
              Edit
            </button>
            <button
              onClick={() => mutate()}
              className="px-3 py-1 w-16 bg-red-500 text-white rounded hover:bg-red-600 transition deleteBtn"
            >
              {isPending ? (
                <div className='flex justify-center items-center gap-2'>
                  <LoadingSpinner size={10}/>
                </div>
              ) : "Delete"}
            </button>
          </div>
        </td>
      </tr>
      
    </>
  )
}

export default InstructorCourses