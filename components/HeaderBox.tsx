export default function HeaderBox({type="title",subtext,title,user}: HeaderBoxProps) {
  return (
   <div className="header-box">
    <h1 className="header-box-title">
      {title}
      {type === 'greeting' && (
        <span className="text-[#E65C00]">&nbsp;{user}</span>
        )}
      </h1>
    <p className="header-box-subtext">{subtext}</p>
</div>
  );
}