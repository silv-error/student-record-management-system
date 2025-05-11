import { useQuery } from '@tanstack/react-query'

const useGetEnrolledStudents = ({ courseId }) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["enrolledStudents"],
    queryFn: async () => {
      if(!courseId) return [];
      try {
        const res = await fetch(`/api/courses/${courseId}/enrolled`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: 1
  });

  return { data, isLoading, refetch }
}

export default useGetEnrolledStudents