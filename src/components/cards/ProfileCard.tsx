
const ProfileCard = () => {
  return (
    <div>
      <div className="flex justify-center">
        <img src="/image/user.jpg" alt="user" className="h-[150px] w-[150px] rounded-full"/>
      </div>
      <div className="text-center mt-[20px]">
        <p className="font-medium text-slate-600">10-06-2024</p>
        <h3 className="font-[600] text-[20px] text-slate-[600] text-maincolor">John Doe</h3>
        <p className="text-[14px] text-slate-500">Software Developer</p>
      </div>
    </div>
  )
}

export default ProfileCard
