import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useUser from '../context/UserProvider';
import profileImg from '../assets/profile_img.jpg';

export default function Profile() {
  const navigate = useNavigate();

  // Destructure with default values
  const {
    user,
    loading = false,
    error = null,
    fetchUserProfile,
    setUser,
    logout
  } = useUser();

  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    avatar: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // Local loading and error states
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Load user data when component mounts or user changes
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!user) {
          await fetchUserProfile();
        }
      } catch (err) {
        console.error('Profile loading error:', err);
        navigate('/login');
      }
    };

    loadProfile();
  }, [user, fetchUserProfile, navigate]);

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        avatar: user.avatar || '',
      });

      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      setAvatarPreview(user.avatar ? `${backendUrl}${user.avatar}` : profileImg);
    }
  }, [user]);


  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle avatar file upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setLocalError(null);

    try {
      // Create form data for file upload
      const updateData = new FormData();
      updateData.append('username', formData.username);
      updateData.append('email', formData.email);
      updateData.append('phoneNumber', formData.phoneNumber);

      // Append avatar if a new file is selected
      if (avatarFile) {
        updateData.append('avatar', avatarFile);
      }

      // Send update request
      const response = await axios.put('/api/users/updateProfile', updateData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update user in context
      setUser(response.data.updatedUser);

      // Exit edit mode
      setIsEditing(false);
      setLocalLoading(false);
    } catch (error) {
      console.error('Profile update error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      setLocalError(error.response?.data?.message || 'Failed to update profile');
      setLocalLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    // Reset form to original user data
    setFormData({
      username: user.username || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
    });
    setAvatarPreview(user.avatar || profileImg);
    setIsEditing(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 text-red-500">
        {error}
      </div>
    );
  }

  // Local loading state for update
  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-xl text-gray-600">Updating profile...</div>
      </div>
    );
  }

  // Local error state for update
  if (localError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 text-red-500">
        {localError}
      </div>
    );
  }

  // Render profile or edit form
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
        <div className="bg-blue-400 h-24 relative">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            {isEditing ? (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  id="avatarUpload"
                />
                <label
                  htmlFor="avatarUpload"
                  className="cursor-pointer"
                >
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-36 h-36 rounded-full border-6 border-white shadow-2xl object-cover hover:opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100">
                    Change Photo
                  </div>
                </label>
              </div>
            ) : (
              <img
                src={user?.avatar || profileImg}
                alt="Profile"
                className="w-36 h-36 rounded-full border-6 border-white shadow-2xl object-cover"
              />
            )}
          </div>
        </div>

        <div className="pt-20 p-6">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  required
                />
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {user?.username || 'User Name'}
                </h2>
                <p className="text-gray-600 mb-4">{user?.email || 'user@example.com'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Contact Information</h3>
                  <p><strong>Phone:</strong> {user?.phoneNumber || 'Not Provided'}</p>
                  <p><strong>Email:</strong> {user?.email || 'Not Provided'}</p>
                </div>

                <div className="bg-gray-100 p-3 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Account Details</h3>
                  <p><strong>User ID:</strong> {user?._id || 'N/A'}</p>
                  <p><strong>Role:</strong> {user?.role || 'Customer'}</p>
                  <p><strong>Status:</strong>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs 
                        ${user?.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'}
                      `}
                    >
                      {user?.status || 'Active'}
                    </span>
                  </p>
                  <p><strong>Joined:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
