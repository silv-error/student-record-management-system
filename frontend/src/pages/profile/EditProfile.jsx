import { useState } from 'react'

const EditProfile = ({ formData, setFormData, handleSubmit, handleOnChange}) => {

  return (
    <div id="editMode" className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          <form className="col-span-3 space-y-4 bg-white p-4 rounded-lg ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="firstName">First Name</label>
                  <input onChange={handleOnChange} id="firstName" name="firstName" type="text" placeholder="Enter first name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" required/>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="phone">Phone</label>
                  <input onChange={handleOnChange} id="phone" name="phone" type="tel" placeholder="Enter phone number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                  <div>
                    <label className="block text-gray-700 text-sm mb-1" htmlFor="yearLevel">Year Level</label>
                    <select 
                      id="yearlevel" 
                      name="yearLevel"
                      defaultValue={""}
                      onChange={handleOnChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="" disabled>Select Year</option>
                      <option value="1st year">1st year</option>
                      <option value="2nd year">2nd year</option>
                      <option value="3rd year">3rd year</option>
                      <option value="4th year">4th year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1" htmlFor="course">Course</label>
                    <input onChange={handleOnChange} id="course" name="course" type="text" placeholder="Enter Course"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg" required/>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="middleName">Middle Name</label>
                  <input onChange={handleOnChange} id="middleName" name="middleName" type="text" placeholder="Enter middle name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" required/>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="email">Email</label>
                  <input onChange={handleOnChange} id="email" name="email" type="email" placeholder="Enter email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                  <div>
                    <label className="block text-gray-700 text-sm mb-1" htmlFor="province">Street Address</label>
                    <input onChange={handleOnChange} id="province" name="province" type="text" placeholder="Enter Street Address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg" required/>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1" htmlFor="postalCode">Province</label>
                    <input onChange={handleOnChange} id="postalCode" name="postalCode" type="text" placeholder="Enter Province"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg" required/>
                  </div>
                </div>


              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="lastName">Last Name</label>
                  <input onChange={handleOnChange} id="lastName" name="lastName" type="text" placeholder="Enter last name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" required/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                  <div>
                    <label className="block text-gray-700 text-sm mb-1" htmlFor="gender">Gender</label>
                    <select 
                      id="gender" 
                      name="gender"
                      defaultValue={""}
                      onChange={handleOnChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="" disabled>Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1" htmlFor="dob">Date of Birth</label>
                    <input onChange={handleOnChange} id="dob" name="dateOfBirth" type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
                  <div>
                    <label className="block text-gray-700 text-sm mb-1" htmlFor="province">City</label>
                    <input onChange={handleOnChange} id="province" name="province" type="text" placeholder="Enter City"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg" required/>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1" htmlFor="postalCode">Postal Code</label>
                    <input onChange={handleOnChange} id="postalCode" name="postalCode" type="text" placeholder="Enter postal code"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg" required/>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1" htmlFor="country">Country</label>
                    <input onChange={handleOnChange} id="country" name="country" type="text" placeholder="Enter country"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg" required/>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile