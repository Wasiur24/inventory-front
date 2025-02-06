import apiClient from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  role: "user" | "admin";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData  {
  name: string;
  phone: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
}

const UserService = {
  // login: async (credentials: LoginCredentials) => {
  //   const response = await apiClient.post("/user/login", credentials);
  //   console.log(response,"dsfghj");
  //   if (response.data.token) {
  //     localStorage.setItem("token", response.data.token);
  //     localStorage.setItem("user", JSON.stringify(response.data.user));
  //   }
  //   return response.data;
  // },

  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post("/user/login", credentials);
    console.log(response, "dsfghj");

    if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
},

  register: async (data: RegisterData) => {
    const response = await apiClient.post("/user/register", data);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get("/user/profile");
    return response.data;
  },

  updateProfile: async (id: string, data: Partial<User>) => {
    const response = await apiClient.put(`/user/update/${id}`, data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default UserService;
