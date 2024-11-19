const refresh = async() => {
    if (!localStorage.getItem('refreshToken')) return;
    const new_token = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
},
body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken'), accessToken: localStorage.getItem('accessToken') })
});
const access = await new_token.json();
localStorage.setItem('accessToken', access.token);
}
export default refresh;