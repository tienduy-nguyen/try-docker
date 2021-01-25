export type UserWhereUniqueInput = {
  id?: number | null;
  email?: string | null;
};
export type SortOrder = {
  asc: 'asc';
  desc: 'desc';
};
export type FindManyUserArgs = {
  skip?: number;
  take?: number;
  include?: {
    posts: {
      orderBy: {
        title: 'asc';
      };
      select: {
        title: true;
      };
    };
  };
  orderBy?: [
    {
      id: 'asc';
    },
    {
      email: 'asc';
    },
  ];
};
