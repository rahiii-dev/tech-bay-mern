import useAxios from "../../hooks/useAxios";

const ProfilePage = () => {
    const {data, loading, error} = useAxios({
        url: '/user/profile',
        method: 'GET'
    });

    return (
        <div>
            <h1>Profile Page</h1>
        </div>
    );
}

export default ProfilePage;
