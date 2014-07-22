function leafNavigate
% drive some robots through a 2D vascular structure using the mouse or keyboard.
% The robots are quite simple -- they all move in the direction you command
% until they hit an obstacle or another robot. Similar games include
% Richochet Robots and Atomix, but here ALL the robots move at each
% command.  This simulates magnetotactic bacteria, or magnetized
% tetrahymena pyriformis.  This example appears in
% "Reconfiguring Massive Particle Swarms with Limited, Global Control",
% by Aaron Becker, Erik Demaine, S�ndor Fekete, Golnaz Habibi, and James McLurkin
% 9th International Symposium on Algorithms and Experiments for Sensor Systems,
% Wireless Networks and Distributed Robotics September 5-6, 2013. (Fig. 1)
%
% Author: Aaron Becker
%
% video: http://www.youtube.com/watch?v=eExZO0HrWRQ
% http://www.youtube.com/user/aabecker5
%
%Now uses 8-point connectivity by mapping
% q,w,e
% a,  d
% z,x,c
% to the 8 directions.  You can also use the keyboard arrows to move in 8
% directions, or use the mouse to follow arbitrary angles (uses Bresenham algorithm for this).
global G MAKE_MOVIE RobotPts
clear all
clc
format compact
MAKE_MOVIE = true;
PLAY_GAME = true;  % if true, sets goal positions (Making this a very hard game)
G.myPath = [];
G.fig = figure(1);
G.numCommands = 0;
G.totalMoves = 0;
G.goals =[];
numGoals = 0; %#ok<NASGU>
FrameCount = 1;
MOVIE_NAME = 'VascularNetworkNavigate10';
if MAKE_MOVIE
    writerObj = VideoWriter(MOVIE_NAME,'MPEG-4');%http://www.mathworks.com/help/matlab/ref/videowriterclass.html
    set(writerObj,'Quality',100)
    %set(writerObj, 'CompressionRatio', 2);
    open(writerObj);
end


imgname = 'leafBW.png';
[BW,map] = imread(imgname); %#ok<NASGU>
G.obstacle_pos = rot90(1-BW',2);
%G.obstacle_pos = flipud(1-BW');
%G.obstacle_pos = zeros(size(G.obstacle_pos));
%create vector of robots and draw them.  A robot vector consists of an xy
%position and a color.
RobotPts =    [765,   336,1,1;
    770 ,  329,2,2;
    764 ,  324,3,3;
    778 ,  322,4,4;
    769 ,  311,5,5;
    ];
RobotPts(:,1) = size(G.obstacle_pos,2)+1-RobotPts(:,1);

% a sample path for 5 robots:
%G.myPath = [ -3.0983    2.0386    3.0633   -2.4755    3.0712   -3.1239    2.8463   -2.6887    2.8358    2.7922    2.9520    2.0646    1.9245    1.8796, 1.5522    2.2420    2.2118    1.0457    2.0230   -0.8220   -2.4420   -2.5104   -1.8643   -2.0579];
% This path takes 5 robots to different places.
G.myPath = pi-[    2.7776   -2.1360    2.9686    2.8572    1.3480    0.8497    2.0207    1.6868    1.4384    1.8775    1.7184    2.0832    2.5068    1.8458,    2.1358    1.5495    2.1489   -2.9480   -2.6605   -2.1474    3.0040   -2.7140   -0.3271   -0.1214   -2.5512   -1.8684   -1.6009   -2.5029,   -1.9609   -1.7520   -1.5784   -2.1006   -1.3003   -2.4299   -1.6653   -2.0752   -1.7552   -2.1869   -0.9842   -2.3105   -1.5797    3.1207,   -2.7743    3.1332    1.9862    1.0648    1.6067    2.1173   -2.4847    3.0700   -2.9086    2.1306   -2.8893    2.9367   -2.7982    2.8984,   -2.8207    3.0039    2.8442   -2.7527    2.7148   -3.0317    2.7757   -2.9472    2.9100   -3.0928    2.7895    2.2131    1.7643    2.3571,    2.0234    1.7658    2.2824    1.6140   -0.9257   -2.0081    0.2143    0.5685   -0.8509    0.4710   -1.6509   -0.7825   -0.0675   -0.3420,   -0.0394   -2.2007   -1.2081    1.4950   -2.4113   -2.3222   -1.7498    3.1412   -2.4062   -2.6104    2.8948   -0.0031    2.7551    2.8501,   -1.3935   -0.5697   -0.5232   -0.1789   -2.5100    1.7367   -2.1786   -1.1867   -3.1329    1.9882   -0.8246   -2.9432   -2.2731   -2.5727,   -2.3857   -3.0260   -2.3039    3.1257    2.4746    1.8279    2.5034    0.2100    1.1198    1.6610    0.5301    1.2663   -3.0725   -2.2845,   -1.3098   -0.5017   -0.2175    0.7129   -2.3439   -0.2566   -0.1473   -1.2827    2.8342   -2.7624    2.8878   -2.7576   -0.1611   -3.0500,    2.9760   -1.8528   -1.3044   -0.4422    2.9528   -2.9263   -2.7526    2.4208    2.9268    2.1611    2.4117    1.8427    2.5548   -3.1364,   -2.7663    2.3894    1.8298    2.9560   -2.8178    2.3459    2.5819    2.3893    3.0108    2.3557    2.6253    1.8691    0.1800   -0.1089,   -0.3680    1.3030    1.0685    0.9978    0.8664    1.8279    0.9660    1.5173    1.0362    1.8928    1.6683    1.0339    2.5420    2.5836];
G.goals = [  234   596;184   113;  60   409; 638   609;   633    52;       ];
numGoals = size(G.goals,1);
G.goals(:,1) = size(G.obstacle_pos,2)+1-G.goals(:,1);

G.EMPTY = 0;
G.OBST = 1;
G.maxX = size(G.obstacle_pos,2);
G.maxY = size(G.obstacle_pos,1);

numRobots = size(RobotPts,1);
clf
set(G.fig,'Units','normalized','outerposition',[0 0 1 1],'NumberTitle','off','Color',[0.0 0.0 0.0]);%'MenuBar','none',
set(G.fig, 'InvertHardCopy', 'off');
colors = hsv(numel(unique(RobotPts(:,4))));
G.colormap = [  1,1,1; %Empty = white
    0,0,0; %obstacle
    ];

colormap(G.colormap);
G.axis=imagesc(G.obstacle_pos);

G.path = [];
set(gca,'box','off','xTick',[],'ytick',[],'ydir','normal');%,'Visible','off');
%set(G.axis,'edgealpha',.08)
axis equal
axis tight
G.title = title('press arrows keys to move');
set(G.title,'Color','w','FontSize',16)
%ginput(5)
%screen_size = get(0, 'ScreenSize');
%set(f1, 'Position', [0 0 screen_size(3) screen_size(4) ] );
G.rad = 4;
G.hRobots = zeros(1, numRobots);
G.rLines = zeros(1, numRobots);
G.th = linspace(0,2.1*pi,50);
for hi = 1: numRobots
    %G.rLines(hi) = line(RobotPts(hi,1),RobotPts(hi,2),'Color',0.8*colors(RobotPts(hi,4),:),'linewidth',3);
    G.rLines(hi) =  patch([NaN,RobotPts(hi,1)],[NaN,RobotPts(hi,2)],0.8*colors(RobotPts(hi,4),:),'linewidth',5,'EdgeColor',0.8*colors(RobotPts(hi,4),:));
    %G.hRobots(hi) =  rectangle('Position',[RobotPts(hi,1)-rad/2,RobotPts(hi,2)-rad/2,rad,rad],'Curvature',[1,1],'FaceColor',colors(RobotPts(hi,4),:),'linewidth',2,'EdgeColor',0.3*colors(RobotPts(hi,4),:));
    G.hRobots(hi) = patch(RobotPts(hi,1)+G.rad*cos(G.th),RobotPts(hi,2)+G.rad*sin(G.th),colors(RobotPts(hi,4),:),'linewidth',2,'EdgeColor',0.3*colors(RobotPts(hi,4),:));
end
sc = 50;
G.VectorLineX = sc*[-3, -3, -1,-1,0,-1,  -1,  -3, -3];
G.VectorLineY = sc*[ 0,1/2,1/2, 1,0,-1,-1/2,-1/2,0]/2;
vecColor = [0,0,0.8];
G.VectorLineW = patch(G.VectorLineX,G.VectorLineY,vecColor,'linewidth',4,'EdgeColor',vecColor);
%G.VectorLineB = line(G.VectorLineX,G.VectorLineY,'color','k','linewidth',2);
set(gca, 'Position', [0 0 .95 .95])
if PLAY_GAME
    set(G.title, 'string', {'Drive the robots to their targets using your mouse or the keyboard';'Arrow keys or [q,w,e,a,d,z,x,c]'})
    while numGoals < numRobots
        pos = [floor(rand(1)*G.maxX+1),floor(rand(1)*G.maxY+1)] ;
        if G.obstacle_pos(pos(2),pos(1)) == 0
            G.goals(numGoals+1,:) = pos;
            numGoals = numGoals+1;
        end
    end
    G.radG = 3*G.rad;
    G.hGoals = zeros(numRobots,1);
    
    for i = 1:numRobots
        %rectangle('Position',[G.goals(i,1),G.goals(i,2),1,1],'linewidth',2,'Curvature',[1,1],'FaceColor',colors(i,:),'EdgeColor',0.9*colors(i,:));
        G.hGoals(i) = patch(G.goals(i,1)+G.radG*cos(G.th),G.goals(i,2)+G.radG*sin(G.th),0.7*colors(i,:),'linewidth',6,'EdgeColor',0.7*colors(i,:),'FaceColor','none');
        %rectangle('Position',[G.goals(i,1)-G.radG/2,G.goals(i,2)-G.radG/2,G.radG,G.radG],'linewidth',4,'Curvature',[1,1],'FaceColor','none','EdgeColor',0.7*colors(i,:));
    end
    
    for i = 1:numRobots
        uistack( G.hRobots(i),'top');
    end
    
end

if MAKE_MOVIE
    set(G.fig ,'Name','Massive Control'); %#ok<UNRCH>
else
    set(G.fig,'KeyPressFcn',@keyhandler,'Name','Massive Control')
    set(G.fig,'WindowButtonDownFcn',@mousehandler, 'WindowButtonMotionFcn', @mousemove)
end


if MAKE_MOVIE
    %%%% VIDEO SCRIPT:
    %  <Show pyriformis cells and magnetic coils>  these cells can be steered by an external magnetic field
    %  <show video OR my simulation> ..but cells all move in the same direction
    %  Given a Vascular network
    set(G.title, 'string', '');
    uistack(G.VectorLineW,'bottom');
    for i = 1:numRobots
        uistack(G.rLines(i),'bottom');
        uistack(G.hRobots(i),'bottom');
        set(G.hGoals(i),'linewidth',1,'EdgeColor',colors(i,:));
        %uistack(G.hGoals(i),'bottom');
    end
    for i = 1:20
        updateDrawing;
    end
    %  5 goal positions
    for i = 1:numRobots
        uistack(G.hGoals(i),'top');
        for hi = [0,1,2,3,4,5,6]
            set(G.hGoals(i),'linewidth',4+hi,'EdgeColor',min(1,(0.7+hi*.1))*colors(i,:));
            updateDrawing;
        end
    end
    for hi = [5,4,3,2]
        uistack(G.hGoals(i),'top');
        for  i = 1:numRobots
            set(G.hGoals(i),'linewidth',4+hi,'EdgeColor',min(1,(0.7+hi*.1))*colors(i,:));
            
        end
        updateDrawing;
    end
    %  and 5 robots
    updateDrawing;
    for i = 1:numRobots
        uistack(G.rLines(i),'top');
    end
    for i = 1:numRobots
        uistack(G.hRobots(i),'top');
        hi = .5;
        %set(G.hRobots(i),'Position',[RobotPts(i,1)-(hi*rad)/2,RobotPts(i,2)-(hi*rad)/2,(hi*rad),(hi*rad)]);
        set(G.hRobots(i),'Xdata', RobotPts(i,1)+(hi*G.rad)*cos(G.th),'Ydata',RobotPts(i,2)+(hi*G.rad)*sin(G.th));
        
    end
    for i = 1:numRobots
        for hi = [.5,1,1.5,2,3,4,3,2,1.5,1]
            %set(G.hRobots(i),'Position',[RobotPts(i,1)-(hi*rad)/2,RobotPts(i,2)-(hi*rad)/2,(hi*rad),(hi*rad)]);
            set(G.hRobots(i),'Xdata', RobotPts(i,1)+(hi*G.rad)*cos(G.th),'Ydata',RobotPts(i,2)+(hi*G.rad)*sin(G.th));
            updateDrawing;
        end
    end
%     for i = 1:numRobots
%         uistack(G.hGoals(i),'top');
%     end
    uistack(G.VectorLineW,'top');
end

for i = 1:numel(G.myPath)
    G.rAtGoal = 0;
    uistack(G.VectorLineW,'top');
    %implement a pre-programmed route
    % draw vector arrow
    angle = G.myPath(i);
    xMax = size(G.obstacle_pos,2);
    yMax = size(G.obstacle_pos,1);
    x = G.maxX/2 +cos(angle)*70+ cos(angle)*G.VectorLineX-sin(angle)*G.VectorLineY;
    y = G.maxY/2 +sin(angle)*70+ sin(angle)*G.VectorLineX+cos(angle)*G.VectorLineY;
    set(G.VectorLineW,'Xdata', [x,xMax/2] ,'YData',[y,yMax/2]);
    set(G.title, 'string', ['  ', num2str(G.rAtGoal),' of ', num2str(numRobots),' robots at goal, Step ',num2str(i),'  ']);
    uistack(G.VectorLineW,'top');
    updateDrawing;
    
    
    moveAlongAngle(G.myPath(i));
    set(G.title, 'string', ['  ', num2str(G.rAtGoal),' of ', num2str(numRobots),' robots at goal, Step ',num2str(i),'  ']);
    uistack(G.VectorLineW,'top');
    updateDrawing;
    
    if i == 1
        for hi = 1:20
            updateDrawing
        end
    end
    %  that move in same direction until hitting an obstacle
    %  is there an input sequence to move robots to goal?
    %  For this example, the answer is yes   <count the number of moves at top>
    %  In our paper we prove this problem is NP-hard
end
for i = 1:10
    updateDrawing;
end
set(G.title, 'string', 'finished');

display(sortrows(RobotPts,3))

    function keyhandler(src,evnt) %#ok<INUSL>
        if strcmp(evnt.Key,'s')
            imwrite(flipud(get(G.axis,'CData')+1), G.colormap, 'Aleafpic.png');
        else
            moveto(evnt.Key)
        end
    end


    function moveto(key)
        % Maps keypresses to moving pixels
        step = [0,0];
        if strcmp(key,'leftarrow') || strcmp(key,'a') %-x
            RobotPts = sortrows(RobotPts,1);
            step = -[1,0];
        elseif strcmp(key,'rightarrow')|| strcmp(key,'d') %+x
            RobotPts = sortrows(RobotPts,-1);
            step = [1,0];
        elseif strcmp(key,'uparrow')|| strcmp(key,'w') %+y
            RobotPts = sortrows(RobotPts,-2);
            step = [0,1];
        elseif strcmp(key,'downarrow')|| strcmp(key,'x') %-y
            RobotPts = sortrows(RobotPts,2);
            step = -[0,1];
        elseif strcmp(key,'leftarrow') || strcmp(key,'q') %-x,+y
            RobotPts = sortrows(RobotPts,1);
            step = [-1,+1];
        elseif strcmp(key,'rightarrow')|| strcmp(key,'e') %+x,+y
            RobotPts = sortrows(RobotPts,-1);
            step = [1,1];
        elseif strcmp(key,'uparrow')|| strcmp(key,'c') %+x,-y
            RobotPts = sortrows(RobotPts,-1);
            step = [1,-1];
        elseif strcmp(key,'downarrow')|| strcmp(key,'z') %-x-y
            RobotPts = sortrows(RobotPts,1);
            step = [-1,-1];
        end
        % implement the move on every robot
        movement = 0;
        for ni = 1:size(RobotPts,1)
            stVal = RobotPts(ni,1:2);
            desVal = RobotPts(ni,1:2)+step;
            
            % move there if no robot in the way and space is free
            while  ~ismember(desVal,RobotPts(:,1:2),'rows')  ...
                    && desVal(1) >0 && desVal(1) <= G.maxX && desVal(2) >0 && desVal(2) <= G.maxY ...
                    && G.obstacle_pos( desVal(2),desVal(1) )==0
                RobotPts(ni,1:2) = desVal;
                desVal = RobotPts(ni,1:2)+step;
                movement = 1;
            end
            if ~isequal( stVal, RobotPts(ni,1:2) )
                %set(G.hRobots(RobotPts(ni,3)),'Position',[RobotPts(ni,1)-rad/2,RobotPts(ni,2)-rad/2,rad,rad]);
                set(G.hRobots(RobotPts(ni,3)),'Xdata', RobotPts(ni,1)+(G.rad)*cos(G.th),'Ydata',RobotPts(ni,2)+(G.rad)*sin(G.th));
            end
            xD = [get(G.rLines(RobotPts(ni,3)),'Xdata'),RobotPts(ni,1)];
            yD = [get(G.rLines(RobotPts(ni,3)),'Ydata'),RobotPts(ni,2)];
            set(G.rLines(RobotPts(ni,3)),'Xdata',xD,'Ydata',yD);
        end
        if movement
            G.path(end+1) = atan2(step(2),step(1));
            display(G.path)
            calculateSuccess();
        end
    end

    function calculateSuccess()
        if PLAY_GAME
            G.rAtGoal = 0;
            for ni = 1:numRobots
                rIndex = RobotPts(ni,3);
                set(G.hGoals(rIndex), 'EdgeColor',0.5*colors(rIndex,:));
                if sum((RobotPts(ni,1:2) - G.goals(rIndex,1:2)).^2)< G.radG^2
                    G.rAtGoal = G.rAtGoal+1;
                    
                    set(G.hGoals(rIndex), 'EdgeColor',colors(rIndex,:));
                    
                end
            end
            set(G.title, 'string', ['  ', num2str(G.rAtGoal),' of ', num2str(numRobots),' robots at goal']);
            
        end
    end


    function mousemove(~,~,~)
        %draw a line showing where the robot will move
        pt = get(gca,'Currentpoint');
        xMax = size(G.obstacle_pos,2);
        yMax = size(G.obstacle_pos,1);
        if pt(1,1)>=0 && pt(1,1)<=xMax && pt(1,2)>=0 && pt(1,2)<=yMax
            %x = [xMax/2, pt(1,1)];
            %y = [yMax/2, pt(1,2)];
            angle = atan2( pt(1,2) - yMax/2, pt(1,1) - xMax/2);
            x =pt(1,1) + cos(angle)*G.VectorLineX-sin(angle)*G.VectorLineY;
            y =pt(1,2) + sin(angle)*G.VectorLineX+cos(angle)*G.VectorLineY;
            set(G.VectorLineW,'Xdata', [x,xMax/2] ,'YData',[y,yMax/2]);
            %set(G.VectorLineB,'Xdata', [xMax/2,x] ,'YData',[yMax/2,y]);
        else
            set(G.VectorLineW,'Xdata', 0 ,'YData',0);
            %set(G.VectorLineB,'Xdata', 0 ,'YData',0);
        end
        
    end

    function  mousehandler(~,~,~)
        pt = get(gca,'Currentpoint');
        xMax = size(G.obstacle_pos,2);
        yMax = size(G.obstacle_pos,1);
        %if pt(1,1)>=0 && pt(1,1)<=xMax && pt(1,2)>=0 && pt(1,2)<=yMax
        if xMax/2 ==  pt(1,1) && yMax/2 == pt(1,2)
            return;
        end
        angle = atan2( pt(1,2) - yMax/2, pt(1,1) - xMax/2);
        moveAlongAngle(angle)
    end

    function moveAlongAngle(angle)
        xMax = size(G.obstacle_pos,2);
        yMax = size(G.obstacle_pos,1);
        length = xMax+yMax;
        [yP,xP] = bresenham(angle, length);
        
        %sort the robots
        if abs(angle) <= pi/4
            RobotPts = sortrows(RobotPts,1);
        elseif pi/4 < angle && angle<= 3*pi/4
            RobotPts = sortrows(RobotPts,2);
        elseif 3*pi/4 <= abs(angle)
            RobotPts = sortrows(RobotPts,-1);
        elseif -pi/4 > abs(angle) && abs(angle) >= -3*pi/4
            RobotPts = sortrows(RobotPts,-2);
        end
        
        % implement the move on every robot
        movement = 0;
        for ni = 1:size(RobotPts,1)
            stVal = RobotPts(ni,1:2);
            step = [xP(1),yP(2)];
            desVal = RobotPts(ni,1:2)+step;
            count = 1;
            % move there if no robot in the way and space is free
            while  ~ismember(desVal,RobotPts(:,1:2),'rows')  ...
                    && desVal(1) >0 && desVal(1) <= G.maxX && desVal(2) >0 && desVal(2) <= G.maxY ...
                    && G.obstacle_pos( desVal(2),desVal(1) )==0 ...
                    && count < numel(xP)-1
                RobotPts(ni,1:2) = desVal;
                movement = 1;
                count = count+1;
                step = [xP(count),yP(count)];
                desVal = RobotPts(ni,1:2)+step;
            end
            if ~isequal( stVal, RobotPts(ni,1:2) )
                %set(G.hRobots(RobotPts(ni,3)),'Position',[RobotPts(ni,1)-rad/2,RobotPts(ni,2)-rad/2,rad,rad]);
                set(G.hRobots(RobotPts(ni,3)),'Xdata', RobotPts(ni,1)+(G.rad)*cos(G.th),'Ydata',RobotPts(ni,2)+(G.rad)*sin(G.th));
            end
            xD = [get(G.rLines(RobotPts(ni,3)),'Xdata')',RobotPts(ni,1)];
            yD = [get(G.rLines(RobotPts(ni,3)),'Ydata')',RobotPts(ni,2)];
            set(G.rLines(RobotPts(ni,3)),'Xdata',xD,'Ydata',yD);
        end
        if movement
            G.path(end+1) = angle;
            display(G.path)
            calculateSuccess()
        end
    end

    function [xP,yP] = bresenham(angle, length)
        x = [0,  round(cos(angle)*length)];
        y = [0,  round(sin(angle)*length)];
        steep = (abs(y(2)-y(1)) > abs(x(2)-x(1)));
        if steep,
            [x,y] = swap(x,y);
        end
        signCh = 0;
        if x(1)>x(2),
            [x(1),x(2)] = swap(x(1),x(2));
            signCh = 1;
        end
        
        delx = x(2)-x(1);
        dely = abs(y(2)-y(1));
        error = 0;
        
        if signCh,  x_n = -1; else x_n = 1;          end
        if y(1) < y(2), ystep = 1; else ystep = -1; end
        xP = zeros(1,delx);
        yP = zeros(1,delx);
        for n = 1:delx
            y_n = 0;
            error = error + dely;
            if 2*error >= delx%bitshift(error,1) >= delx, % same as -> if 2*error >= delx,
                y_n = ystep;
                error = error - delx;
            end
            
            if steep,
                xP(n) = x_n;
                yP(n) = y_n;
            else
                xP(n) = y_n;
                yP(n) = x_n;
            end
        end
    end
    function [q,r] = swap(s,t)
        % function SWAP
        q = t; r = s;
    end

    function updateDrawing
        drawnow
        if(MAKE_MOVIE)
            FrameCount=FrameCount+1;
            set(gcf,'color','k');
            set(gca,'color','k');
            F = getframe_nosteal_focus; %getframe;
            writeVideo(writerObj,F.cdata);
            while(FrameCount < 10)
                updateDrawing
            end
        end
    end
end