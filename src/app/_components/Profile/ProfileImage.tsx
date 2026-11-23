import Image from 'next/image'

type Props = {
  imgSrc?: string
}

// The member's name is the card's adjacent heading, so the photo is decorative
// (alt=""). next/image lazy-loads natively (loading="lazy") by default.
export const ProfileImage: React.FC<Props> = ({ imgSrc }) => {
  return (
    <div className="profile-image-container">
      {imgSrc ? (
        <Image
          className="profile-image"
          src={imgSrc}
          alt=""
          width="200"
          height="200"
        />
      ) : (
        <div className="profile-image profile-image-placeholder profile-no-image mono-label">
          No image
        </div>
      )}
    </div>
  )
}
