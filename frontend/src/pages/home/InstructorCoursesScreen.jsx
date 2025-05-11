import { useMutation, useQuery } from '@tanstack/react-query';
import InstructorCourses from './InstructorCourses';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import ViewCourseModal from './ViewCourseModal';

const InstructorCoursesScreen = () => {

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["instructorCourses"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/courses/");
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

  const [semesterFilter, setSemesterFilter] = useState("");
  const filteredCourses = data?.courses?.filter((course) => course?.semester?.toLowerCase().includes(semesterFilter.toLowerCase()));

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    units: "",
    yearLevel: "",
    semester: "",
    room: "",
    day: "",
    startTime: "",
    endTime: "",
  });

  const { mutateAsync: editCourse, isLoading: editingCourse } = useMutation({
    mutationKey: ["editCourse"],
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/courses/edit/${selectedItem?._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
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
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
    let startTime = new Date();
    let endTime = new Date();
    if (!iso8601Regex.test(formData.startTime)) {
      const [startHours, startMinutes] = formData.startTime.split(":");
      startTime.setHours(startHours);
      startTime.setMinutes(startMinutes);
    }
    if (!iso8601Regex.test(formData.endTime)) {
      const [endHours, endMinutes] = formData.endTime.split(":");
      endTime.setHours(endHours);
      endTime.setMinutes(endMinutes);
    }
    setFormData({
      ...formData,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });
    await editCourse(formData);
    await refetch();
    setSelectedItem(null); // Close the modal or reset selected item
  }

  const handleOnChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setFormData({
      code: selectedItem?.code,
      title: selectedItem?.title,
      units: selectedItem?.units,
      yearLevel: selectedItem?.yearLevel,
      semester: selectedItem?.semester,
      room: selectedItem?.room,
      day: selectedItem?.day,
      startTime: selectedItem?.startTime,
      endTime: selectedItem?.endTime,
    })
  }, [selectedItem]);

  const [addSubjectModal, setAddSubjectModal] = useState(false);
  const [courseData, setCourseData] = useState({
    code: "",
    title: "",
    units: "",
    yearLevel: "",
    semester: "",
    room: "",
    day: "",
    startTime: "",
    endTime: "",
  });

  const { mutateAsync: createCourse, isPending: creatingCourse } = useMutation({
    mutationKey: ["createCourse"],
    mutationFn: async () => {
      try {
        const res = await fetch("/api/courses/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(courseData)
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
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
    const startTime = new Date();
    const endTime = new Date();
    if (!iso8601Regex.test(courseData.startTime)) {
      const [startHours, startMinutes] = courseData?.startTime?.split(":");
      startTime.setHours(startHours);
      startTime.setMinutes(startMinutes);
    }
    if (!iso8601Regex.test(courseData.endTime)) {
      const [endHours, endMinutes] = courseData?.endTime?.split(":");
      endTime.setHours(endHours);
      endTime.setMinutes(endMinutes);
    }
    setCourseData({
      ...courseData,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });
    await createCourse();
    await refetch();
  }

  const handleCourseOnChange = (e) => {
    e.preventDefault();
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  }

  const [viewModalData, setViewModalData] = useState(null);

  if (isLoading) {
    return (
      <div className='h-full w-full flex justify-center items-center my-auto'>
        <LoadingSpinner size={50} />
      </div>
    )
  }

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
                  <th scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code
                  </th>
                  <th scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title
                  </th>
                  <th scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units
                  </th>
                  <th scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year
                    Level</th>
                  <th scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester</th>
                  <th scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room
                  </th>
                  <th scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day
                  </th>
                  <th scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start
                    Time</th>
                  <th scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End
                    Time</th>
                  <th scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses?.map((item) => (
                  <InstructorCourses
                    key={item._id}
                    item={item}
                    setSelectedItem={setSelectedItem}
                    setViewModalData={setViewModalData}
                  />
                ))}
                {!data?.courses && (
                  <tr>
                    <td colSpan={10} className='text-center font-medium text-gray-700 p-10'>
                      Oops! No subjects are available right now.
                    </td>
                  </tr>
                )}
                {(!filteredCourses?.length && data?.courses) && (
                  <tr>
                    <td colSpan={10} className='text-center font-medium text-gray-700 p-10'>
                      No subjects in this semester.
                    </td>
                  </tr>
                )}
                <tr>
                  <td onClick={() => setAddSubjectModal(true)} colSpan={10} className="text-center py-2 cursor-pointer hover:bg-slate-100">
                    <span className='flex justify-center'><Plus /></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* edit course modal  */}
      <div className={`${selectedItem ? "block" : "hidden"} absolute inset-0 flex justify-center items-center bg-gray-900 bg-opacity-55`}>
        <form onSubmit={handleSubmit} className="relative mb-6 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Course</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="editCourseCode" className="block text-sm font-medium text-gray-700">Course Code</label>
              <input
                value={formData?.code || ""}
                name='code'
                onChange={handleOnChange}
                type="text"
                id="editCourseCode"
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="editCourseTitle" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                value={formData?.title || ""}
                name='title'
                onChange={handleOnChange}
                type="text"
                id="editCourseTitle"
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="editCourseUnits" className="block text-sm font-medium text-gray-700">Units</label>
              <input
                value={formData?.units || ""}
                name='units'
                onChange={handleOnChange}
                type="number"
                id="editCourseUnits"
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="editCourseYear" className="block text-sm font-medium text-gray-700">Year Level</label>
              <select
                value={formData?.yearLevel || ""}
                name='yearLevel'
                onChange={handleOnChange}
                id="editCourseYear"
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value={""} disabled></option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div>
              <label htmlFor="editCourseSemester" className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                value={formData?.semester || ""}
                name='semester'
                onChange={handleOnChange}
                id="editCourseSemester"
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="" disabled>Choose semester</option>
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="Summer">Summer</option>
              </select>
            </div>
            <div>
              <label htmlFor="editCourseRoom" className="block text-sm font-medium text-gray-700">Room</label>
              <input
                value={formData?.room || ""}
                name='room'
                onChange={handleOnChange}
                type="text"
                id="editCourseRoom"
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="editCourseDay" className="block text-sm font-medium text-gray-700">Day</label>
              <select
                value={formData?.day}
                name='day'
                onChange={handleOnChange}
                id="editCourseDay"
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="" disabled>Select day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            <div>
              <label htmlFor="editCourseStart" className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                value={formData?.startTime?.split("T").pop().split(".")[0].split(":").slice(0, 2).join(":")}
                name='startTime'
                onChange={handleOnChange}
                type="time"
                id="editCourseStart"
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="editCourseEnd" className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                value={formData?.endTime?.split("T").pop().split(".")[0].split(":").slice(0, 2).join(":")}
                name='endTime'
                onChange={handleOnChange}
                type="time"
                id="editCourseEnd"
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button id="saveCourseEdit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Save Changes</button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setSelectedItem(null)
              }}
              id="cancelCourseEdit"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* add course modal  */}
      <div className={`${addSubjectModal ? "block" : "hidden"} absolute flex inset-0 justify-center items-center bg-gray-900 bg-opacity-55`}>
        <form onSubmit={handleCourseSubmit} className="relative mb-6 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add Subject</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="editCourseCode" className="block text-sm font-medium text-gray-700">Course Code</label>
              <input
                type="text"
                name='code'
                onChange={handleCourseOnChange}
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="editCourseTitle" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                onChange={handleCourseOnChange}
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="editCourseUnits" className="block text-sm font-medium text-gray-700">Units</label>
              <input
                type="number"
                name='units'
                onChange={handleCourseOnChange}
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="editCourseYear" className="block text-sm font-medium text-gray-700">Year Level</label>
              <select
                name='yearLevel'
                onChange={handleCourseOnChange}
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="" disabled>Select year level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div>
              <label htmlFor="editCourseSemester" className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                name='semester'
                onChange={handleCourseOnChange}
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="" disabled>Select semester</option>
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="Summer">Summer</option>
              </select>
            </div>
            <div>
              <label htmlFor="editCourseRoom" className="block text-sm font-medium text-gray-700">Room</label>
              <input
                type="text"
                name='room'
                onChange={handleCourseOnChange}
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="editCourseDay" className="block text-sm font-medium text-gray-700">Day</label>
              <select
                name='day'
                onChange={handleCourseOnChange}
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="" disabled>Select day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            <div>
              <label htmlFor="editCourseStart" className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                name='startTime'
                onChange={handleCourseOnChange}
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="editCourseEnd" className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                name='endTime'
                onChange={handleCourseOnChange}
                className="h-8 px-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              {creatingCourse ? (
                <div className='flex justify-center items-center gap-2'>
                  <LoadingSpinner size={20} />
                </div>
              ) : "Add Subjects"}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setAddSubjectModal(false);
              }}
              id="cancelCoursebtn"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* <!-- View Course Modal -->  */}
      <ViewCourseModal viewModalData={viewModalData} setViewModalData={setViewModalData} />
    </div>
  )
}

export default InstructorCoursesScreen