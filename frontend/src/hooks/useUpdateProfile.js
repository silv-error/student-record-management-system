import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/authContext';

const useUpdateProfile = () => {
  const {setAuthUser} = useAuthContext();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["profileImg"],
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/api/users/edit", {
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

        localStorage.setItem("student-record-user", JSON.stringify(data.user));
        setAuthUser(data.user);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"]})
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return { mutateAsync, isPending }
}

export default useUpdateProfile