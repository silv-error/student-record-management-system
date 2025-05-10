import { formattedTime } from '../utils/date';

const InstructorCourses = ({ item }) => {

  const startTime = formattedTime(item.startTime);
  const endTime = formattedTime(item.endTime);

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.code}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.title}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.units}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.room}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.day}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{startTime} - {endTime}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button className={`px-2 py-1 text-xs rounded text-yello`}>View</button>
      </td>
    </tr>
  )
}

export default InstructorCourses