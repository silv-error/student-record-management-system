import { formattedTime } from '../utils/date'

const StudentCourses = ({ item }) => {

  const startTime = formattedTime(item.startTime);
  const endTime = formattedTime(item.endTime);

  let gradeStatusBg;
  if(item?.students[0].grade < 75 && item?.students[0].grade !== null) {
    gradeStatusBg = "bg-red-100 text-red-800";
  } else if(item?.students[0].grade >= 75 && item?.students[0].grade < 80) {
    gradeStatusBg = "bg-yellow-100 text-yellow-800";
  } else if(item?.students[0].grade >= 80) {
    gradeStatusBg = "bg-green-100 text-green-800"
  } else {
    gradeStatusBg = "bg-gray-100 text-gray-800"
  }

  return (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.code}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.title}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.units}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.room}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.day}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{startTime} - {endTime}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.professor.firstName} {item.professor.lastName}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 text-xs rounded ${gradeStatusBg } text-yello`}>{item.students[0].grade ? item?.students[0].grade : "In Progress"}</span>
        </td>
      </tr>
    </>
  )
}

export default StudentCourses