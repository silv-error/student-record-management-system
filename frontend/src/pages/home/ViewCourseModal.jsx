import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { formattedTime } from '../utils/date';
import toast from 'react-hot-toast';
import useGetEnrolledStudents from '../../hooks/useGetEnrolledStudents';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toTitleFormat } from '../utils/text';
import useGetStudents from '../../hooks/useGetStudents';
import EnrolledStudents from './EnrolledStudents';

const ViewCourseModal = ({ viewModalData, setViewModalData }) => {

  const { mutate, isPending } = useMutation({
    mutationKey: ["enrollStudent"],
    mutationFn: async (email) => {
      try {
        const res = await fetch(`/api/courses/enroll/${viewModalData?._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      } finally {
        refetch();
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const { mutate: unenrollStudent, isPending: pendingUnenrollStudent } = useMutation({
    mutationKey: ["unenrollStudent"],
    mutationFn: async (studentId) => {
      try {
        const res = await fetch(`/api/courses/unenroll/${viewModalData?._id}/${studentId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      } finally {
        refetch();
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const { data, isLoading, refetch } = useGetEnrolledStudents({ courseId: viewModalData?._id });
  const { data: getStudents, isLoading: loadingStudents, refetch: refetchStudents } = useGetStudents();
  useEffect(() => {
    refetch();
    refetchStudents();
  }, [viewModalData]);
  const [term, setTerm] = useState("");
  const handleSearchTerm = (e) => {
    setTerm(e.target.value);
  }
  const filteredStudents = getStudents?.users?.filter((student) => student?.email.toLowerCase().includes(term.toLowerCase()))

  const [addStudentModal, setAddStudentModal] = useState(false);

  const [editStudentModal, setEditStudentModal] = useState(null);
  const [grade, setGrade] = useState("");
  const { mutateAsync: editGrade, isPending: settingGrade } = useMutation({
    mutationKey: ["editGrade"],
    mutationFn: async (studentId) => {
      try {
        const res = await fetch(`/api/grades/${viewModalData?._id}/${studentId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ grade })
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      refetch();
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });


  const totalPassing = data?.filter((elem) => elem?.grade > 75);
  const passingRate = parseFloat((totalPassing?.length / data?.length) * 100).toFixed(2);

  return (
    <div id="viewCourseModal" className={`${viewModalData ? "block" : "hidden"} fixed z-10 inset-0 overflow-y-auto`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Course Details - {toTitleFormat(viewModalData?.title)} ({viewModalData?.code?.toUpperCase()})</h3>
              <button
                onClick={() => setAddStudentModal(true)}
                id="addStudentBtn"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
              >
                Add Student
              </button>
            </div>

            {/* <!-- Add Student Form -->  */}
            <div id="addStudentForm" className={`${addStudentModal ? "block" : "hidden"} mb-4 p-4 bg-gray-50 rounded-lg`}>
              <div className="flex justify-center w-full">
                <div className='w-96'>
                  <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700">Search Email</label>
                  <input
                    name='email'
                    value={term}
                    onChange={handleSearchTerm}
                    type="email"
                    id="studentEmail"
                    placeholder='e.g, sample@email.com'
                    className="h-8 px-4 mt-1 block w-full max-w-xl rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setAddStudentModal(false)}
                    id="cancelAddStudent"
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className='flex flex-col items-center p-4'>
                <ul>
                  {term && filteredStudents?.map((student) => (
                    <li key={student._id} className='flex items-center gap-4 p-2 max-w-2xl'>
                      <img src={student.profileImg || "https://avatar.iran.liara.run/public/30"} className='size-10 rounded-full object-cover' />
                      <p className='font-medium'>{toTitleFormat(`${student.firstName} ${student.lastName}`)}</p>
                      <p className='text-slate-600 mr-10'>{student.email}</p>
                      <button
                        onClick={() => {
                          mutate(student.email);
                          setTerm("");
                        }}
                        id="submitAddStudent"
                        className="px-4 py-2 ml-auto bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm mr-2"
                      >
                        {isPending ? (
                          <div className='flex justify-center items-center gap-2'>
                            <LoadingSpinner size={20} />
                          </div>
                        ) : "Add"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* <!-- Edit Student Form (Initially Hidden) -->  */}
            <div id="editStudentForm" className={`${editStudentModal ? "block" : "hidden"} mb-4 p-4 rounded-lg`}>
              <h4 className="text-md font-medium text-gray-700 mb-3">Edit Student Record</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="editStudentId" className="block text-sm font-medium text-gray-700">Student ID</label>
                  <input
                    type="text"
                    value={editStudentModal?._id}
                    className="h-10 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="editStudentName" className="block text-sm font-medium text-gray-700">Student Name</label>
                  <input
                    type="text"
                    value={`${editStudentModal?.firstName} ${editStudentModal?.middleName} ${editStudentModal?.lastName}`}
                    id="editStudentName"
                    className="h-10 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="editStudentGrade" className="block text-sm font-medium text-gray-700">Grade</label>
                  <input
                    type="number"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    step="0.01"
                    maxLength="100"
                    className="h-10 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={async () => {
                    await editGrade(editStudentModal?._id);
                    setGrade("")
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                >
                  {settingGrade ? (
                    <div className='flex gap-2 justify-center items-center'>
                      <LoadingSpinner size={20} />
                    </div>
                  ) : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditStudentModal(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Student ID</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Student Name</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Email</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Grade</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Status</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" id="studentTableBody">
                  {data?.map((student) => (
                    <EnrolledStudents
                      key={student.student._id}
                      student={student}
                      setEditStudentModal={setEditStudentModal}
                      unenrollStudent={unenrollStudent}
                      pendingUnenrollStudent={pendingUnenrollStudent}
                    />
                  ))}
                  {isLoading && (
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

            {/* <!-- Course Info Section -->  */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Course Information</h4>
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-medium">Code: </span>{viewModalData?.code?.toUpperCase()}</p>
                  <p className="text-sm"><span className="font-medium">Title: </span>{toTitleFormat(viewModalData?.title)}</p>
                  <p className="text-sm"><span className="font-medium">Units: </span>{viewModalData?.units}</p>
                  <p className="text-sm"><span className="font-medium">Schedule: </span>
                    {viewModalData?.day}, {formattedTime(viewModalData?.startTime)} - {formattedTime(viewModalData?.endTime)}
                  </p>
                  <p className="text-sm"><span className="font-medium">Room: </span>{viewModalData?.room?.toUpperCase()}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Name Statistics</h4>
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-medium">Total Students:</span> {data?.length} </p>
                  <p className="text-sm"><span className="font-medium">Passing Rate:</span> {passingRate}%</p>
                  <p className="text-sm"><span className="font-medium">Passing Grade:</span> 75</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => setViewModalData(false)}
              className="closeModalBtn w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2
              bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewCourseModal