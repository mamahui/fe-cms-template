export function parseJson(jsonStr) {
  try {
    return JSON.parse(jsonStr) || {};
  } catch (e) {
    return{}
  }
}
export const logout = () => {
  window.localStorage.removeItem('userInfo');
  window.localStorage.removeItem('activeNav');
  window.location.href = '/login';
};

export const saveUserInfo = (userInfo) => {
  window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
};
