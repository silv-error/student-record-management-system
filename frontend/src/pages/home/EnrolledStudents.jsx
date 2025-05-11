import { Trash } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Link } from 'react-router-dom';

const EnrolledStudents = ({ student, setEditStudentModal, unenrollStudent, pendingUnenrollStudent }) => {

  let status;
  let statusTheme;
  if(student.grade < 75 && student.grade != null) {
    status = "Failed";
    statusTheme = "bg-red-100 text-red-800"
  } else if(student.grade >= 75) {
    status = "Passed";
    statusTheme = "bg-green-100 text-green-800"
  } else {
    status = "On going";
    statusTheme = "bg-gray-100 text-gray-800"
  }

  return (
    <tr>
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student?.student?._id}</td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{student?.student?.firstName} {student?.student?.middleName} {student?.student?.lastName}</td>
      <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500`}>{student?.student?.email}</td>
      <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500`}>{student?.grade ? student?.grade : "In Progress"}</td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusTheme}`}>
          {status}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">
        <div className="flex justify-center space-x-2">
          <Link to={`/profile/${student?.student?._id}`}>
            <button className="px-3 py-2 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600 transition edit-btn">
              View Profile
            </button>
          </Link>
          <button
            onClick={() => setEditStudentModal(student?.student)}
            className="px-3 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600 transition edit-btn"
            data-student-id="2023-001"
            data-student-name="John Doe"
            data-grade="1.25"
            data-status="Passed"
          >
            Edit
          </button>
          <button
            onClick={() => unenrollStudent(student?.student?._id)}
            className="px-3 py-1 rounded transition delete-btn"
            data-student-id="2023-001"
          >
            {pendingUnenrollStudent ? (
              <div className='flex justify-center items-center'>
                <LoadingSpinner size={20} />
              </div>
            ) : <Trash size={20} className='hover:text-red-600' />}
          </button>
        </div>
      </td>
    </tr>
  )
}

export default EnrolledStudents