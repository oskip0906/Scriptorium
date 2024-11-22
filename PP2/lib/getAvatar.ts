const getAvatar = async (userId: number) => {
    const response = await fetch(`/api/Profile/${userId}`, {
        method: 'GET'
    });
    if (!response.ok) {
        console.log('Error fetching avatar');
        return '';
    }
    const data = await response.json();
    if (data.avatar) {
      console.log(data);
      const avatarResponse = await fetch(data.avatar);
      if (avatarResponse.ok) {
        return data.avatar;
      }
    }
    return '';
} 

export default getAvatar;