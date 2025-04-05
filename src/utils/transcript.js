// transcript.js
export const hardcodedTranscript = `0:00
hi the topic is breath for search and
0:02
depth for search in this video I'll
0:04
cover these two traversal methods by
0:07
taking various
0:09
examples breath for search and DEP for
0:11
search are graph traversal
0:13
methods so we'll understand quickly the
0:17
difference between them through this a
0:19
small example then afterward I'll take
0:22
another example and I will explain you
0:24
in
0:25
detail now for quick understanding I
0:27
have taken a simple graph actually it's
0:29
a tree but a tree is also a graph so let
0:33
us see so for traversal both of these
0:36
traversal we have to know these two
0:40
terms now for understanding these uh
0:42
traversals we should know two terms one
0:44
is visiting a Vertex means going on a
0:46
particular vertex second term is
0:49
exploration of vertex exploration means
0:51
if I am on some particular vertex then
0:54
visiting all its adjacent vertices is
0:56
called as
0:57
exploration So based on these two terms
1:00
we can understand traversals so first I
1:02
will explain you breath first search see
1:05
I'm selecting vertex one as the starting
1:07
vertex to find out breath first search
1:09
we can select any vertex as a starting
1:11
vertex now vertex one I will visit the
1:14
vertex
1:16
one now once the vertex is visited this
1:19
vertex I will start exploring means I
1:22
will visit all adjacent vertices so who
1:25
are those 5 4 and 2 in which order I can
1:29
visit I can visit them in any order so
1:31
okay I will take two first then four
1:33
then
1:36
five next I should select the next
1:39
vertex for exploration so these are
1:41
already visited vertices after one I
1:43
have visited 2 4 5 then I should explore
1:46
explore what I will explore two so who
1:49
are adjacent to two adjacent to two are
1:51
7 6 3 in which order you can take you
1:54
can take them in any order s then three
1:56
then six in any order you can take
1:59
that's all all the vertices are visited
2:01
and there is no vertex remaining for
2:04
exploration this is breath first search
2:08
now let us look at depth first
2:11
search I'll start from vertex one then
2:15
from one I have start its exploration so
2:19
I'll go to vertex
2:20
two two now who are other adjacent
2:24
vertices four and five no don't visit
2:28
them you have reach a new vertex so you
2:31
start exploring that vertex okay I'll
2:34
start exploring two then who are
2:36
adjacent to this 7 6 and three so I want
2:39
to go to three okay go to three then
2:43
shall I visit 6 and 7 also no this is
2:45
depth first search start exploring three
2:49
so if I start exploring three there is
2:51
nothing connected to three okay so it
2:54
means three is completely explored then
2:57
come back and then continue the
2:59
exploration of of two so who are there
3:04
six explore six nothing is there come
3:07
back go to 7 explore 7 visit 7 explore 7
3:11
there's nothing so come back to one now
3:14
and continue the exploration of one who
3:17
are adjacent to it four visit four and
3:19
explore four there's nothing come back
3:22
then go to five five now in this way all
3:26
are explored so the traversals are
3:31
different results are different so in
3:34
breath for search we will explore a
3:36
Vertex then we go to the next vertex for
3:39
exploration but in depth first search
3:42
once we started exploring once we
3:44
visited a new vertex we will suspend
3:47
this Vortex and start its exploration so
3:50
from one we got two so we started
3:52
exploring two then from two we went on
3:54
three so we'll start exploring three
3:56
like this so in Def for search approach
3:59
is different and breath for search
4:01
approach is different so I'll take one
4:03
more example and explain you what is the
4:05
difference between breath for search and
4:06
death for search with a simple example
4:09
one more example let us find breath for
4:14
surge actually this is a binary
4:17
tree tree is also a graph so let us
4:21
perform breath first search and see so
4:23
as per binary tree I will perform level
4:25
order one then 2 3
4:29
then
4:31
4567 45 67 this is breath for search
4:36
means breath for search is just like a
4:39
level order on a binary
4:42
tree then what is a depth first
4:46
search visit one okay explore one so we
4:50
got two so stop exploring one and start
4:53
exploring two so four stop exploring two
4:56
and continue exploration of four there
4:58
is nothing so go back and come to five
5:01
now nothing is remaining so go back to
5:03
one and come on this side then six then
5:06
go back and 7 so this is like pre-order
5:10
so breath for search is just like level
5:14
order and depth for search is just like
5:19
pre-order traversal of a
5:22
graph I have taken a bigger graph
5:25
now we will learn about breath for Surge
5:29
and death for sech in
5:31
detail first of all breath first search
5:34
for performing breath first search I
5:36
will take one data structure that is
5:43
Q I have taken a q now I'll explain you
5:48
initial step then I will explain you
5:50
repeating step so what is the initial
5:52
step start exploration from any one of
5:56
the vertex so which vertex I should
5:57
select as a starting vertex for bre for
5:59
search you can select any vertex you
6:01
like so I'll select vertex one so in the
6:05
answer you show it one in the graph you
6:07
draw here again then add it to
6:10
Q This is the first step initial step
6:14
now we will perform repeating steps so
6:16
what are those repeating steps take out
6:18
a Vertex from q and start exploring it
6:22
so vertex one who are adjacent to one 4
6:25
and two so explore them so first I want
6:28
to visit four 4 Okay add it to result
6:32
and also add it to Q next I want to go
6:34
to two Okay add it to result and also
6:38
add it to Q now one is completely
6:41
explored there is no adjacent vertex
6:43
remaining for vertex one this is first
6:46
iteration
6:47
completed now repeat the procedure what
6:50
to do next select next vertex for
6:52
exploration from q that is four start
6:55
exploring four so who is adjacent to
6:57
four three so I'm drawing it like a tree
7:00
here so three is adjacent so add it to Q
7:04
any other adjacent for four nothing is
7:06
adjacent for four so four is completely
7:10
explored now select next vertex for
7:13
exploration that is two who are adjacent
7:16
to
7:17
two 3 5 7 8 I can visit them in any
7:23
order if I check three it's already
7:25
explode so then I will prefer going on
7:28
five first so five five next I want to
7:32
go on8 okay 8 so 8 and 8 next I will go
7:38
on 7 so 7 and add seven here now two is
7:43
completely
7:45
explored now select next vertex for
7:47
exploration who is that three is there
7:50
any Adent vertices for three yes 2 8 9
7:53
and 10 so two is already visited so
7:56
first I will take 10 10
8:00
10 and then
8:02
9 9 add it to
8:05
Q complet it three is completely
8:08
explored now select next vertex for
8:10
exploration five anybody adjacent to
8:13
five yes 8 and 7 and six so 8 already
8:18
visited 7 already visited
8:22
six this is six so six and six five is
8:27
completely explored select the next
8:30
vertex for exploration eight who is
8:32
adjacent to eight 2 and 7 two actually
8:36
we came from there 7even draw a dotted
8:39
line so vertex which is already visited
8:41
we are drawing a dotted line then next
8:44
vertex for exploration
8:45
seven 7 is already exploded so is there
8:49
anything remaining for seven no 10 there
8:51
is nothing nearer to 10 no nothing
8:54
adjacent to 10 there is nothing as
8:57
adjacent to 9 and there is nothing
8:59
adjacent into six so that's all this is
9:02
breath for search completed and the tree
9:06
that we got here is breath for
9:09
search spanning
9:15
tree dotted edges that we got here they
9:18
are called
9:19
as cross edges they are called as cross
9:23
edges uh let us see what are the things
9:25
that we have learned first thing is you
9:28
can start bre for search from any vertex
9:30
you like first point second thing is
9:33
when you are exploring any vertex one
9:36
then you can visit this adjacent
9:38
vertices in any order you
9:40
like this for the second thing then both
9:43
are leniency is given freedom is given
9:46
to select any vertex then what is the
9:48
rule here rule
9:50
is when you are selecting a Vertex for
9:53
exploration you must visit all its
9:55
adjacent
9:57
vertices then only you should go to next
9:59
vertex for exploration so if I am
10:02
exploring one then I should exisit four
10:05
as well as two then only I should select
10:07
four for
10:09
exploration this is the rule the next
10:12
thing is last thing is you should select
10:16
the next Vortex for exploration from a q
10:19
only so q and exploration should be
10:23
completely done these are the two
10:25
important points about breath first
10:26
surge follow this one then you you can
10:29
get many answers I will write few more
10:32
valid breath first searches
10:36
here first
10:38
one I'll start from vertex one then I'll
10:41
explore the adjacent vertices so first
10:43
I'll explore two then
10:45
four then I have to start exploring two
10:48
because I have visited two first so who
10:50
are adjacent to two so I will take eight
10:52
then 5 then 7 then three these are
10:55
adjacent to two all these are adjacent
10:57
to two then I should explore which one
10:59
four so who are adjacent to four three
11:01
is already over then explore eight who
11:04
is adjacent to eight five and seven both
11:06
are visited now explore
11:09
7 so this is six now explore three so 10
11:14
and 9 so 10 and 9 this is one also this
11:18
one is also a valid answer then one more
11:22
I'll start exploration from five from
11:25
five who are adjacent 2 8 7 and and
11:30
six now explore two who are adjacent to
11:33
two 3 and 1 now explore 8 7 is already
11:38
visited seven everything is visited six
11:43
nothing is there so everything is
11:44
visited explore three so 9 and
11:48
10 and four so for three 9 10 and four I
11:52
have visited now explore one nothing is
11:54
remaining 9 10 4 all are visited so this
11:57
is also valid
12:00
so like this you can start from any
12:02
vertex and you can visit the adjacent in
12:04
any order so you can form numerous
12:06
number of
12:07
valid breadth for
12:10
search next we will see depth for search
12:13
now next is depth for search for this I
12:16
will take a stack stack is a data
12:19
structure used
12:24
here let us start I can start the
12:28
traversal from any vertex I like so I
12:31
want to start from vertex one so one is
12:34
visited this is the initial step now the
12:38
repeating step what I have to do every
12:41
time as this new Vortex is visited start
12:44
exploring it so who are adjacent to that
12:47
four and two so visit 4
12:52
4
12:54
4 now the rule in bre depth for searches
12:58
what once you have visited one vertex
13:00
still one more is remaining leave that
13:03
we will see it afterwards first you
13:05
start exploring
13:07
four so this is the rule so once you
13:10
have reached a new vertex start
13:12
exploring that new vtex what about that
13:14
one suspend it and keep it in the step
13:17
that we can explore it later now start
13:20
exploring four so from four I can go on
13:22
three so okay go to three three is
13:24
visited now what to do suspend four and
13:29
start exploring three from three I can
13:31
go on 10 so 10 suspend three start
13:36
exploring 10 there is no adjacent vertex
13:39
of 10 so go back to three so how to know
13:42
where I have to go back this stack will
13:44
give me their value so this three
13:46
continue exploring three so I can go on
13:48
nine 9 and again suspend three and start
13:53
exploring N9 from 9 I cannot go
13:56
anywhere then go back to three and start
14:00
exploring three so who is adjacent to
14:02
three two so two is
14:06
visited then from two who is adjacent
14:09
suspend two and start exploring two so
14:12
from two 8 is adjacent so take
14:16
eight now start exploring eight so from
14:19
there I can go on seven so suspend eight
14:22
so 7 is
14:24
visited now we have to explore seven
14:26
from Seven I can go on five so five is
14:31
newly visited now we have to start
14:33
exploring five so suspend seven and push
14:36
it into the stack then from five who is
14:39
adjacent six so visit six suspend five
14:44
and continue exploration of six there is
14:48
nothing adjacent to six so go back to
14:50
five from five where I can go further so
14:54
I can visit two which is already
14:56
completed right I can visit eight which
14:59
which is already completed so there is
15:01
nothing remaining for five so what
15:03
happens in this way is we are going deep
15:05
and deep right so in this way almost all
15:08
vertices are visited only they are
15:10
completely explored so five is
15:12
completely explored go back to the
15:14
previous vertex who is that seven seven
15:17
from Seven where I can go from Seven I
15:19
can go on two which is already
15:21
visited then go back to 8 from 8 nothing
15:25
is remaining so from two where I can go
15:28
I can go to one
15:31
right then nothing is remaining so go
15:33
back to four from four I cannot go
15:35
anywhere from three one I cannot visit
15:39
anywhere so that's all right so here is
15:43
the def for search traversal result and
15:47
this is a DFS spanning tree this is
15:51
depth for
15:53
search spanning
15:56
tree and these edges are called called
15:59
as back
16:03
edges so for this graph we can make a
16:08
tree like and perform pre-order so this
16:10
is the pre-order of this tree see 1 4 3
16:13
10 then 9 then 2 8 756 1 4 3 9 8 2 so 9
16:20
2 8
16:22
756 so this is like pre-order traversal
16:26
now I will write few more valid depth
16:30
for search directly looking into the
16:33
graph I'll start from vertex
16:36
one one this is the first one from one
16:40
I'll go to two from two I'll go to
16:43
8 from 8 I will go to 7 from Seven I'll
16:48
go to five then six from six I cannot go
16:52
anywhere come back to five two is
16:54
already completed s also completed so
16:56
what was the root I have taken so come
16:58
back to 7 7 is completely explored come
17:01
back to eight nothing remaining come
17:03
back to two so from two I'll go to three
17:07
then nine nothing is there come back and
17:09
go to 10 then go back to three and go to
17:13
four then one is already explode so
17:16
return back to four then three then two
17:17
then one
17:19
finished so this is one answer then one
17:23
more I'll
17:25
show I'll start from vex
17:29
three first is three then I'll visit to
17:33
four then one then two then five then
17:37
six from six and cannot go anywhere come
17:39
back to five come back to five and go to
17:41
S then
17:43
8 right from eight I back on two but is
17:47
already over so complete go back to
17:49
seven then five then come back to two
17:51
then two from there I have already gone
17:54
to um one one is already completed right
17:57
so come back to four then come back to
17:59
three so from three who are remaining 10
18:01
and N so 10 then nine this is also valid
18:06
so you can start from any vertex you
18:08
like and you can visit any neighboring
18:10
vertex but only thing is once you have
18:12
visited a new vertex suspend the
18:15
exploration of current vertex and start
18:17
exploring new
18:19
vertex that's all about def first search
18:22
and breath first search and the time
18:23
complexity of both these methods is
18:25
order of n n is number of is`; // Your full transcript here
